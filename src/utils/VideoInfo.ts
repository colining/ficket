export default class VideoInfo {
  href: string;

  imgUrl: string;

  title: string;

  videoRegex: string;

  constructor(href: string, imgUrl: string, title: string, videoRegex: string) {
    this.href = href;
    this.imgUrl = imgUrl;
    this.title = title;
    this.videoRegex = videoRegex;
  }
}
