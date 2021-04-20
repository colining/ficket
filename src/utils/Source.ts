export default class Source {
  videoRegex: string;

  homepageUrl: string;

  searchUrlPrefix: string;

  videoDetailUrlRegex: string;

  playlistItemRegex: string;

  videoUrlRegex: string;

  imgUrlRegex: string;

  titleRegex: string;

  constructor(
    videoRegex: string,
    homepageUrl: string,
    searchUrlPrefix: string,
    videoDetailUrlRegex: string,
    playlistItemRegex: string,
    videoUrlRegex: string,
    imgUrlRegex: string,
    titleRegex: string
  ) {
    this.videoRegex = videoRegex;
    this.homepageUrl = homepageUrl;
    this.searchUrlPrefix = searchUrlPrefix;
    this.videoDetailUrlRegex = videoDetailUrlRegex;
    this.playlistItemRegex = playlistItemRegex;
    this.videoUrlRegex = videoUrlRegex;
    this.imgUrlRegex = imgUrlRegex;
    this.titleRegex = titleRegex;
  }
}
