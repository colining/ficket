import axios from 'axios';
import cheerio from 'cheerio';
import VideoInfo from './VideoInfo';
import { read } from './JsonUtils';

function processImgUrl(img: string | undefined, homepageUrl: string) {
  if (img === undefined) return '';
  if (img.startsWith('http')) return img;
  return homepageUrl + img;
}

export async function getVideoInfoBySource(
  searchKey: string,
  homepageUrl: string,
  searchUrlPrefix: string,
  detailHrefRule: string,
  hrefRule: string,
  imgRule: string,
  titleRule: string,
  videoPlaylistRegex: string,
  videoRegex: string
) {
  const searchUrl = encodeURI(searchUrlPrefix.concat(searchKey));
  return axios
    .get(searchUrl)
    .catch((error: any) => console.log(error))
    .then((response: any) => {
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
        .map((x) => $(x).attr('data-original'));
      const titles = $(titleRule)
        .get()
        .map((x) => $(x).text());
      for (let i = 0; i < hrefs.length; i += 1) {
        result.push(
          new VideoInfo(
            homepageUrl,
            homepageUrl + detailHrefs[i],
            homepageUrl + hrefs[i],
            processImgUrl(imgs[i], homepageUrl),
            titles[i],
            videoPlaylistRegex,
            videoRegex
          )
        );
      }
      return result;
    });
}

export default async function getVideoInfo(searchKey: string) {
  const sources = read();
  const results = [];
  for (let i = 0; i < sources.length; i += 1) {
    results.push(
      getVideoInfoBySource(
        searchKey,
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
  return Promise.all(results);
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
          href: processImgUrl(hrefs[i], homepageUrl),
        });
      }
      return result;
    });
}
