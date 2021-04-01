import axios from 'axios';
import cheerio from 'cheerio';

export default async function getVideoInfo(
  searchKey: string,
  homePageUrl: string,
  searchUrlPrefix: string,
  hrefRule: string,
  imgRule: string,
  titleRule: string
) {
  const searchUrl = encodeURI(searchUrlPrefix.concat(searchKey));
  console.log(searchUrl);
  return await axios
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
        result.push({
          href: homePageUrl + hrefs[i],
          imgUrl: imgs[i],
          title: titles[i],
          w: 'w1',
        });
      }
      return result;
    });
}
