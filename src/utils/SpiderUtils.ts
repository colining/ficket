import axios, { Method } from 'axios';
import cheerio from 'cheerio';
import parse from 'json-templates';
import _ from 'lodash';
import electron from 'electron';
import VideoInfo from '../model/VideoInfo';
import { importData, read } from './JsonUtils';
import { getFormData, withHttp } from './utils';

const { remote } = electron;
const { net, session } = remote;
axios.defaults.withCredentials = true;
function getImgUrl(img: string | undefined, homepageUrl: string) {
  if (img === undefined) return '';
  if (img.startsWith('http')) return img;
  if (img.startsWith('//')) return `http:${img}`;
  return homepageUrl + img;
}

function getVideoDetailUrl(
  haveDetail: boolean,
  homepageUrl: string,
  detailHref: string | undefined
) {
  if (!haveDetail) {
    return '';
  }
  if (detailHref === undefined) return '';
  if (detailHref.startsWith('//')) return `http:${detailHref}`;
  return homepageUrl + detailHref;
}
function getVideoUrl(homepageUrl: string, href: string | undefined) {
  if (!href) {
    return '';
  }
  if (href?.startsWith('http')) return href;
  if (href.startsWith('//')) return `http:${href}`;
  return homepageUrl + href;
}

export async function getVideoInfoBySource(
  searchKey: string,
  method: string,
  formData: string,
  homepageUrl: string,
  searchUrlPrefix: string,
  detailHrefRule: string,
  hrefRule: string,
  imgRule: string,
  titleRule: string,
  videoPlaylistContainerRegex: string,
  videoPlaylistRegex: string,
  videoRegex: string
) {
  let res;
  if (method === 'get') {
    const searchUrl = encodeURI(parse(searchUrlPrefix)({ searchKey }));

    if (searchUrl.startsWith('https://so.youku')) {
      const request = net.request(searchUrl);
      const cookieArray = [
        '_m_h5_tk',
        '_m_h5_tk_enc',
        'UM_distinctid',
        'cna',
        '__ysuid',
        '__ayft',
        '__aysid',
        '__ayscnt',
        'P_ck_ctl',
        'modalFrequency',
        'xlly_s',
        'P_sck',
        'P_gck',
        'disrd',
        'youku_history_word',
        'ctoken',
        '__arpvid',
        '__aypstp',
        '__ayspstp',
        'isg',
        'tfstk',
        'l',
      ];
      const cookieString = await session.defaultSession.cookies
        .get({ domain: '.youku.com' })
        .then((cookies) =>
          cookies
            .map((cookie) => {
              if (cookieArray.includes(cookie.name)) {
                return `${cookie.name}=${cookie.value}`;
              }
              return null;
            })
            .join(';')
        );
      console.log(cookieString);
      request.setHeader('Cookie', cookieString);
      request.setHeader('authority', 'so.youku.com');
      request.setHeader('cache-control', 'max-age=0');
      request.setHeader('upgrade-insecure-requests', '1');
      request.setHeader(
        'user-agent',
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.25 Safari/537.36 Core/1.70.3872.400 QQBrowser/10.8.4455.400'
      );
      request.setHeader(
        'accept',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      );
      request.setHeader('referer', 'https://www.youku.com/');
      request.setHeader('accept-encoding', 'gzip, deflate, br');
      request.setHeader('accept-language', 'zh-CN,zh;q=0.9');

      console.log(request);
      request.on('response', (response) => {
        response.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
      });
      request.end();
    }

    res = axios.get(searchUrl, { timeout: 10000 });

    console.log(searchUrl);
  } else {
    const data = JSON.parse(parse(formData)({ searchKey }));
    res = axios({
      method: method as Method,
      url: searchUrlPrefix,
      data: getFormData(data),
      timeout: 10000,
    });
  }
  return res.then((response: any) => {
    const haveDetail = !_.isEmpty(detailHrefRule);
    const result = [];
    const html = response.data;
    const $ = cheerio.load(html);
    const hrefs = $(hrefRule)
      .get()
      .map((x) => $(x).attr('href'));
    const detailHrefs = $(detailHrefRule)
      .get()
      .map((x) => $(x).attr('href'));
    const imgs = $(imgRule)
      .get()
      .map(
        (x) =>
          $(x).attr('data-original') ||
          $(x).attr('data-src') ||
          $(x).attr('src') ||
          $(x)
            .attr('style')
            ?.match(/\((.*?)\)/)![1]
      );
    $(imgRule)
      .get()
      .map((x) => console.log(x));
    const titles = $(titleRule)
      .get()
      .map((x) => $(x).text());
    for (let i = 0; i < hrefs.length; i += 1) {
      result.push(
        new VideoInfo(
          homepageUrl,
          getVideoDetailUrl(haveDetail, homepageUrl, detailHrefs[i]),
          getVideoUrl(homepageUrl, hrefs[i]),
          getImgUrl(imgs[i], homepageUrl),
          titles[i],
          videoPlaylistContainerRegex,
          videoPlaylistRegex,
          videoRegex
        )
      );
    }
    if (_.isEmpty(result)) {
      throw new Error('result is empty perhaps regex wrong');
    }
    return result;
  });
}

export default async function getVideoInfo(
  searchKey: string,
  workshopSource: Array<any>
) {
  const sources: any[] = workshopSource.concat(read());
  for (let i = 0; i < sources.length; i += 1) {
    if (!_.isNil(sources[i].changedSource)) {
      sources[i] = sources[i].changedSource;
    }
  }
  const results = [];
  for (let i = 0; i < sources.length; i += 1) {
    results.push(
      getVideoInfoBySource(
        searchKey,
        sources[i].method,
        sources[i].formData,
        sources[i].homepageUrl,
        sources[i].searchUrlPrefix,
        sources[i].videoDetailUrlRegex,
        sources[i].videoUrlRegex,
        sources[i].imgUrlRegex,
        sources[i].titleRegex,
        sources[i].playlistContainerRegex,
        sources[i].playlistItemRegex,
        sources[i].videoRegex
      )
    );
  }

  const videoInfos = await Promise.allSettled(results);

  return _.zipWith(sources, videoInfos, (source, videoInfo) => {
    let result: VideoInfo[] = [];
    if (videoInfo.status === 'fulfilled') {
      result = videoInfo.value;
    }
    return {
      videoSource: source.homepageUrl,
      workshopTag: source.workshopTag,
      result,
    };
  });
}

export async function getPlaylist(
  videoUrl: string,
  homepageUrl: string,
  playlistContainerRegex: string,
  playlistItemRegex: string
) {
  return axios
    .get(videoUrl)
    .catch((error: any) => console.log(error))
    .then((response: any) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const playlists = new Array<any>();
      $(playlistContainerRegex)
        .get()
        .forEach((x) => {
          const array = new Array<any>();
          $(playlistItemRegex, $(x))
            .get()
            .forEach((y) => {
              const title = $(y).text();
              const href = $(y).attr('href');
              array.push({ title, href: getImgUrl(href, homepageUrl) });
            });
          playlists.push(array);
        });
      return playlists;
    });
}

export async function updateSourcesFromUrl(url: string) {
  await axios
    .get(withHttp(url))
    .then((response: any) => importData(response.data));
}
