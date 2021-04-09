export default class VideoInfo {
  videoSource: string;

  videoUrl: string;

  imgUrl: string;

  title: string;

  videoRegex: string;

  constructor(
    videoSource: string,
    videoUrl: string,
    imgUrl: string,
    title: string,
    videoRegex: string
  ) {
    this.videoSource = videoSource;
    this.videoUrl = videoUrl;
    this.imgUrl = imgUrl;
    this.title = title;
    this.videoRegex = videoRegex;
  }
}
