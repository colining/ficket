import axios, { Method } from 'axios';
import cheerio from 'cheerio';
import parse from 'json-templates';
import _ from 'lodash';
import VideoInfo from './VideoInfo';
import { importData, read } from './JsonUtils';
import { getFormData, withHttp } from './utils';
import Source from './Source';

function getImgUrl(img: string | undefined, homepageUrl: string) {
  if (img === undefined) return '';
  if (img.startsWith('http')) return img;
  return homepageUrl + img;
}

function getVideoDetailUrl(
  haveDetail: boolean,
  homepageUrl: string,
  detailHref: string | undefined
) {
  return haveDetail ? homepageUrl + detailHref : '';
}

export function getVideoInfoBySource(
  searchKey: string,
  method: string,
  formData: string,
  homepageUrl: string,
  searchUrlPrefix: string,
  detailHrefRule: string,
  hrefRule: string,
  imgRule: string,
  titleRule: string,
  videoPlaylistRegex: string,
  videoRegex: string
) {
  let res;
  if (method === 'get') {
    const searchUrl = encodeURI(parse(searchUrlPrefix)({ searchKey }));
    res = axios({
      method: method as Method,
      url: searchUrl,
    });
  } else {
    const data = JSON.parse(parse(formData)({ searchKey }));
    res = axios({
      method: method as Method,
      url: searchUrlPrefix,
      data: getFormData(data),
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
          $(x).attr('src') ||
          $(x).attr('data-original') ||
          $(x)
            .attr('style')
            ?.match(/\((.*?)\)/)![1]
      );
    const titles = $(titleRule)
      .get()
      .map((x) => $(x).text());
    for (let i = 0; i < hrefs.length; i += 1) {
      result.push(
        new VideoInfo(
          homepageUrl,
          getVideoDetailUrl(haveDetail, homepageUrl, detailHrefs[i]),
          homepageUrl + hrefs[i],
          getImgUrl(imgs[i], homepageUrl),
          titles[i],
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

export default async function getVideoInfo(searchKey: string) {
  const sources: Source[] = read();
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
      result,
    };
  });
}

export async function getPlaylist(
  videoUrl: string,
  homepageUrl: string,
  playlistItemRegex: string
) {
  return axios
    .get(videoUrl)
    .catch((error: any) => console.log(error))
    .then((response: any) => {
      const result = [];
      const html = response.data;
      const $ = cheerio.load(html);
      const hrefs = $(playlistItemRegex)
        .get()
        .map((x) => $(x).attr('href'));
      const titles = $(playlistItemRegex)
        .get()
        .map((x) => $(x).text());
      for (let i = 0; i < hrefs.length; i += 1) {
        result.push({
          title: titles[i],
          href: getImgUrl(hrefs[i], homepageUrl),
        });
      }
      return result;
    });
}

export async function updateSourcesFromUrl(url: string) {
  await axios
    .get(withHttp(url))
    .then((response: any) => importData(response.data));
}
