export default class VideoInfo {
  videoUrl: string;

  imgUrl: string;

  title: string;

  videoRegex: string;

  constructor(
    videoUrl: string,
    imgUrl: string,
    title: string,
    videoRegex: string
  ) {
    this.videoUrl = videoUrl;
    this.imgUrl = imgUrl;
    this.title = title;
    this.videoRegex = videoRegex;
  }
}
