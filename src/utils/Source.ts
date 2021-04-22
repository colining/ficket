export default class Source {
  method: string;

  formData: string;

  videoRegex: string;

  homepageUrl: string;

  searchUrlPrefix: string;

  videoDetailUrlRegex: string;

  playlistItemRegex: string;

  videoUrlRegex: string;

  imgUrlRegex: string;

  titleRegex: string;

  constructor(
    method: string,
    formData: string,
    videoRegex: string,
    homepageUrl: string,
    searchUrlPrefix: string,
    videoDetailUrlRegex: string,
    playlistItemRegex: string,
    videoUrlRegex: string,
    imgUrlRegex: string,
    titleRegex: string
  ) {
    this.method = method;
    this.formData = formData;
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
