export default class Source {
  name: string;

  method: string;

  formData: string;

  videoRegex: string;

  homepageUrl: string;

  searchUrlPrefix: string;

  videoDetailUrlRegex: string;

  playlistContainerRegex: string;

  playlistItemRegex: string;

  videoUrlRegex: string;

  imgUrlRegex: string;

  titleRegex: string;

  workshopTag = false;

  constructor(
    name: string,
    method: string,
    formData: string,
    videoRegex: string,
    homepageUrl: string,
    searchUrlPrefix: string,
    videoDetailUrlRegex: string,
    playlistContainerRegex: string,
    playlistItemRegex: string,
    videoUrlRegex: string,
    imgUrlRegex: string,
    titleRegex: string,
    workshopTag: boolean
  ) {
    this.name = name;
    this.method = method;
    this.formData = formData;
    this.videoRegex = videoRegex;
    this.homepageUrl = homepageUrl;
    this.searchUrlPrefix = searchUrlPrefix;
    this.videoDetailUrlRegex = videoDetailUrlRegex;
    this.playlistContainerRegex = playlistContainerRegex;
    this.playlistItemRegex = playlistItemRegex;
    this.videoUrlRegex = videoUrlRegex;
    this.imgUrlRegex = imgUrlRegex;
    this.titleRegex = titleRegex;
    this.workshopTag = workshopTag;
  }
}
