import axios from 'axios';
import cheerio from 'cheerio';
import VideoInfo from './VideoInfo';

function processImgUrl(img: string | undefined, homePageUrl: string) {
  if (img === undefined) return '';
  if (img.startsWith('http')) return img;
  return homePageUrl + img;
}

export default async function getVideoInfo(
  searchKey: string,
  homePageUrl: string,
  searchUrlPrefix: string,
  hrefRule: string,
  imgRule: string,
  titleRule: string,
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
      const imgs = $(imgRule)
        .get()
        .map((x) => $(x).attr('data-original'));
      const titles = $(titleRule)
        .get()
        .map((x) => $(x).text());
      for (let i = 0; i < hrefs.length; i += 1) {
        console.log('--------需要調查');
        console.log('--------需要調查', homePageUrl);
        console.log('--------需要調查', hrefs[i]);
        console.log('--------需要調查', imgs[i]);
        console.log('--------需要調查');
        result.push(
          new VideoInfo(
            homePageUrl + hrefs[i],
            processImgUrl(imgs[i], homePageUrl),
            titles[i],
            videoRegex
          )
        );
      }
      return result;
    });
}
