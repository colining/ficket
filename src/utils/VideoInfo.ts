export default class VideoInfo {
  videoSource: string;

  videoDetail: string;

  videoUrl: string;

  imgUrl: string;

  title: string;

  videoPlaylistRegex: string;

  videoRegex: string;

  constructor(
    videoSource: string,
    videoDetail: string,
    videoUrl: string,
    imgUrl: string,
    title: string,
    videoPlaylistRegex: string,
    videoRegex: string
  ) {
    this.videoSource = videoSource;
    this.videoDetail = videoDetail;
    this.videoUrl = videoUrl;
    this.imgUrl = imgUrl;
    this.title = title;
    this.videoPlaylistRegex = videoPlaylistRegex;
    this.videoRegex = videoRegex;
  }
}
