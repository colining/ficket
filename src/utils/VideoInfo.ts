export default class VideoInfo {
  href: string;

  imgUrl: string;

  title: string;

  constructor(href: string, imgUrl: string, title: string) {
    this.href = href;
    this.imgUrl = imgUrl;
    this.title = title;
  }
}
