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

async function getVideoInfoOfYouku(
  searchUrl: string,
  detailHrefRule: string,
  hrefRule: string,
  imgRule: string,
  titleRule: string,
  homepageUrl: string,
  videoPlaylistContainerRegex: string,
  videoPlaylistRegex: string,
  videoRegex: string
) {
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

  function a() {
    return new Promise(function (resolve, reject) {
      let body = '';
      request.on('response', (response) => {
        response.on('data', (chunk) => {
          body += chunk.toString();
        });
        response.on('end', () => {
          console.log(body);
          resolve(body);
        });
        response.on('error', () => {
          reject(new Error('error'));
        });
      });
      request.end();
    });
  }

  return a()
    .then(
      (r) => {
        return r;
      },
      (e) => console.log(e)
    )
    .then((html: any) => {
      const haveDetail = !_.isEmpty(detailHrefRule);
      const result = [];
      const $ = cheerio.load(html);
      console.log(hrefRule.split('||'));
      const hrefs = hrefRule.split('||').flatMap((rule) =>
        $(rule)
          .get()
          .map((x) => $(x).attr('href'))
      );
      const detailHrefs = detailHrefRule.split('||').flatMap((rule) =>
        $(rule)
          .get()
          .map((x) => $(x).attr('href'))
      );
      const imgs = imgRule.split('||').flatMap((rule) =>
        $(rule)
          .get()
          .map(
            (x) =>
              $(x).attr('data-original') ||
              $(x).attr('data-src') ||
              $(x).attr('src') ||
              $(x)
                .attr('style')
                ?.match(/\((.*?)\)/)![1]
          )
      );
      const titles = titleRule.split('||').flatMap((rule) =>
        $(rule)
          .get()
          .map((x) => $(x).text())
      );
      console.log(hrefs, titles, imgs);
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
  const searchUrl = encodeURI(parse(searchUrlPrefix)({ searchKey }));
  if (searchUrl.startsWith('https://so.youku')) {
    return getVideoInfoOfYouku(
      searchUrl,
      detailHrefRule,
      hrefRule,
      imgRule,
      titleRule,
      homepageUrl,
      videoPlaylistContainerRegex,
      videoPlaylistRegex,
      videoRegex
    );
  }
  if (method === 'get') {
    res = axios.get(searchUrl, { timeout: 10000 });
  } else {
    const data = JSON.parse(parse(formData)({ searchKey }));
    res = axios({
      method: method as Method,
      url: searchUrl,
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
          if (!_.isEmpty(array)) {
            playlists.push(array);
          }
        });
      return playlists;
    });
}
const usTvShow = {
  subjects: [
    {
      episodes_info: '',
      rate: '7.7',
      cover_x: 1827,
      title: '致命女人 第二季',
      url: 'https://movie.douban.com/subject/34859070/',
      playable: false,
      cover:
        'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2654626463.jpg',
      id: '34859070',
      cover_y: 2704,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.5',
      cover_x: 810,
      title: '瑞克和莫蒂 第五季',
      url: 'https://movie.douban.com/subject/34908206/',
      playable: false,
      cover:
        'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2660594300.jpg',
      id: '34908206',
      cover_y: 1080,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '8.9',
      cover_x: 567,
      title: '野兽家族 第五季',
      url: 'https://movie.douban.com/subject/34678957/',
      playable: false,
      cover:
        'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2631289001.jpg',
      id: '34678957',
      cover_y: 756,
      is_new: true,
    },
    {
      episodes_info: '',
      rate: '6.9',
      cover_x: 890,
      title: '变形金刚：赛博坦之战 第三季',
      url: 'https://movie.douban.com/subject/35208955/',
      playable: false,
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2629737736.jpg',
      id: '35208955',
      cover_y: 1309,
      is_new: true,
    },
    {
      episodes_info: '',
      rate: '8.6',
      cover_x: 2025,
      title: '洛基 第一季',
      url: 'https://movie.douban.com/subject/30331432/',
      playable: false,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2646859929.jpg',
      id: '30331432',
      cover_y: 3000,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '8.9',
      cover_x: 2000,
      title: '东城梦魇',
      url: 'https://movie.douban.com/subject/30441731/',
      playable: false,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2637878518.jpg',
      id: '30441731',
      cover_y: 3000,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.5',
      cover_x: 2028,
      title: '傲骨之战 第五季',
      url: 'https://movie.douban.com/subject/35069434/',
      playable: false,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2655279408.jpg',
      id: '35069434',
      cover_y: 2897,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '6.5',
      cover_x: 1080,
      title: '美国恐怖故事集',
      url: 'https://movie.douban.com/subject/35063924/',
      playable: false,
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2661726466.jpg',
      id: '35063924',
      cover_y: 1350,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.0',
      cover_x: 1500,
      title: '后翼弃兵',
      url: 'https://movie.douban.com/subject/32579283/',
      playable: false,
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2621201524.jpg',
      id: '32579283',
      cover_y: 2222,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '7.7',
      cover_x: 1296,
      title: '白莲花度假村',
      url: 'https://movie.douban.com/subject/35506348/',
      playable: false,
      cover:
        'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2669993942.jpg',
      id: '35506348',
      cover_y: 1920,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '6.8',
      cover_x: 1500,
      title: '爱，死亡和机器人 第二季',
      url: 'https://movie.douban.com/subject/34418203/',
      playable: false,
      cover:
        'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2641221021.jpg',
      id: '34418203',
      cover_y: 2222,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '6.1',
      cover_x: 1889,
      title: '权力的游戏 第八季',
      url: 'https://movie.douban.com/subject/26584183/',
      playable: true,
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2552503815.jpg',
      id: '26584183',
      cover_y: 2731,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.8',
      cover_x: 1170,
      title: '老友记 第十季',
      url: 'https://movie.douban.com/subject/3286552/',
      playable: false,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2187822907.jpg',
      id: '3286552',
      cover_y: 1600,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '8.3',
      cover_x: 1500,
      title: '王国 第二季',
      url: 'https://movie.douban.com/subject/30306401/',
      playable: false,
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2587671506.jpg',
      id: '30306401',
      cover_y: 2222,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '8.1',
      cover_x: 2025,
      title: '异星灾变 第一季',
      url: 'https://movie.douban.com/subject/30345691/',
      playable: false,
      cover:
        'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2616308032.jpg',
      id: '30345691',
      cover_y: 3000,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '7.6',
      cover_x: 819,
      title: '良医 第四季',
      url: 'https://movie.douban.com/subject/34965846/',
      playable: false,
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2620576386.jpg',
      id: '34965846',
      cover_y: 1024,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '8.5',
      cover_x: 1400,
      title: '破产姐妹 第六季',
      url: 'https://movie.douban.com/subject/26758799/',
      playable: true,
      cover:
        'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2426595773.jpg',
      id: '26758799',
      cover_y: 2100,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '8.1',
      cover_x: 2025,
      title: '真探 第三季',
      url: 'https://movie.douban.com/subject/27006232/',
      playable: true,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2543065068.jpg',
      id: '27006232',
      cover_y: 3000,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.1',
      cover_x: 2025,
      title: '足球教练 第二季',
      url: 'https://movie.douban.com/subject/35190584/',
      playable: false,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2669383537.jpg',
      id: '35190584',
      cover_y: 3000,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.6',
      cover_x: 2037,
      title: '绝命毒师  第五季',
      url: 'https://movie.douban.com/subject/6952149/',
      playable: false,
      cover:
        'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p1579021082.jpg',
      id: '6952149',
      cover_y: 3000,
      is_new: false,
    },
  ],
};

const animeDoubanRecommend = {
  subjects: [
    {
      episodes_info: '更新至3集',
      rate: '9.2',
      cover_x: 2024,
      title: '漂流少年',
      url: 'https://movie.douban.com/subject/35427522/',
      playable: true,
      cover:
        'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2659821253.jpg',
      id: '35427522',
      cover_y: 2866,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.5',
      cover_x: 557,
      title: '奇巧计程车',
      url: 'https://movie.douban.com/subject/35332568/',
      playable: false,
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2630996296.jpg',
      id: '35332568',
      cover_y: 800,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '7.7',
      cover_x: 750,
      title: '我叫津岛',
      url: 'https://movie.douban.com/subject/35373033/',
      playable: true,
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2633845275.jpg',
      id: '35373033',
      cover_y: 1061,
      is_new: true,
    },
    {
      episodes_info: '',
      rate: '7.2',
      cover_x: 1160,
      title: '我立于百万生命之上 第二季',
      url: 'https://movie.douban.com/subject/35296064/',
      playable: false,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2630997058.jpg',
      id: '35296064',
      cover_y: 1621,
      is_new: true,
    },
    {
      episodes_info: '更新至15集',
      rate: '9.1',
      cover_x: 906,
      title: '致不灭的你',
      url: 'https://movie.douban.com/subject/34941837/',
      playable: true,
      cover:
        'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2632657962.jpg',
      id: '34941837',
      cover_y: 1280,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '7.9',
      cover_x: 1326,
      title: '阴晴不定大哥哥',
      url: 'https://movie.douban.com/subject/34880365/',
      playable: false,
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2635846406.jpg',
      id: '34880365',
      cover_y: 1920,
      is_new: false,
    },
    {
      episodes_info: '更新至16集',
      rate: '8.7',
      cover_x: 2892,
      title: '咒术回战',
      url: 'https://movie.douban.com/subject/34895145/',
      playable: true,
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2620216005.jpg',
      id: '34895145',
      cover_y: 4096,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.0',
      cover_x: 1200,
      title: '小林家的龙女仆 第二季',
      url: 'https://movie.douban.com/subject/30459061/',
      playable: false,
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2655536384.jpg',
      id: '30459061',
      cover_y: 1690,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.1',
      cover_x: 1500,
      title: '鬼灭之刃',
      url: 'https://movie.douban.com/subject/30210221/',
      playable: true,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2551222097.jpg',
      id: '30210221',
      cover_y: 2121,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.2',
      cover_x: 500,
      title: '名侦探柯南',
      url: 'https://movie.douban.com/subject/1463371/',
      playable: true,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2235972558.jpg',
      id: '1463371',
      cover_y: 709,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.5',
      cover_x: 650,
      title: '海贼王',
      url: 'https://movie.douban.com/subject/1453238/',
      playable: true,
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2197828404.jpg',
      id: '1453238',
      cover_y: 887,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '7.7',
      cover_x: 720,
      title: '瓦尼塔斯的笔记',
      url: 'https://movie.douban.com/subject/35410203/',
      playable: false,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2637287297.jpg',
      id: '35410203',
      cover_y: 1083,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.7',
      cover_x: 1649,
      title: '星际牛仔',
      url: 'https://movie.douban.com/subject/1424406/',
      playable: false,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2011424828.jpg',
      id: '1424406',
      cover_y: 2249,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.6',
      cover_x: 1300,
      title: '强风吹拂',
      url: 'https://movie.douban.com/subject/30238385/',
      playable: true,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2535645337.jpg',
      id: '30238385',
      cover_y: 1838,
      is_new: false,
    },
    {
      episodes_info: '更新至4集',
      rate: '7.9',
      cover_x: 916,
      title: '异世界迷宫黑心企业',
      url: 'https://movie.douban.com/subject/35128773/',
      playable: true,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2637079438.jpg',
      id: '35128773',
      cover_y: 1290,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '8.4',
      cover_x: 1449,
      title: '平稳世代的韦驮天们',
      url: 'https://movie.douban.com/subject/35177664/',
      playable: false,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2653060567.jpg',
      id: '35177664',
      cover_y: 2048,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.4',
      cover_x: 428,
      title: '新世纪福音战士',
      url: 'https://movie.douban.com/subject/1457573/',
      playable: true,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2026157878.jpg',
      id: '1457573',
      cover_y: 606,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.1',
      cover_x: 2000,
      title: '妄想代理人',
      url: 'https://movie.douban.com/subject/1441053/',
      playable: true,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2554114447.jpg',
      id: '1441053',
      cover_y: 3000,
      is_new: false,
    },
    {
      episodes_info: '更新至5集',
      rate: '8.2',
      cover_x: 750,
      title: '转生成为了只有乙女游戏破灭Flag的邪恶大小姐 第二季',
      url: 'https://movie.douban.com/subject/35128791/',
      playable: true,
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2635809694.jpg',
      id: '35128791',
      cover_y: 1050,
      is_new: false,
    },
    {
      episodes_info: '',
      rate: '9.5',
      cover_x: 895,
      title: '乒乓',
      url: 'https://movie.douban.com/subject/25813424/',
      playable: true,
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2166828587.jpg',
      id: '25813424',
      cover_y: 1260,
      is_new: false,
    },
  ],
};
export function getRecommendFromDouban() {
  const map = new Map();
  map.set('anime', animeDoubanRecommend);
  map.set('us', usTvShow);

  return map;
}
export async function updateSourcesFromUrl(url: string) {
  await axios
    .get(withHttp(url))
    .then((response: any) => importData(response.data));
}
