const myMap = new Map();

const script = `
const body = document.querySelector('body.active');
const { children } = body;
for (let i = 0; i < children.length; ) {
  if (
    children[i].tagName != 'SCRIPT' &&
    children[i].className !== 'container'
  ) {
    console.log(i);
    body.removeChild(children[i]);
  } else {
    i++;
  }
}
const video = document.querySelector(
  'body > div.container > div > div.col-lg-wide-75.col-md-wide-7.col-xs-1.padding-0 > div:nth-child(1) > div > div > div.myui-player__item.clearfix'
);
const container = document.querySelector('body > div.container');
container.innerHTML = '';

container.append(video);
`;

const prefix = 'https://e.duboku.fun/';

myMap.set(prefix, script);

export default myMap;
