import React, { useRef, useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import WebView from 'react-electron-web-view';

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

const useStyles = makeStyles(() =>
  createStyles({
    content: {
      flexGrow: 1,
    },
  })
);

export default function MainContainer() {
  const webView = useRef(WebView);
  const [showWebView, setShowWebView] = useState(false);

  const classes = useStyles();

  const handleLoad = () => {
    console.log(webView.current);
    webView.current.openDevTools();
    webView.current.executeJavaScript(script);
    setShowWebView(true);
  };

  return (
    <main className={classes.content}>
      <Toolbar />
      <WebView
        ref={webView}
        style={{
          height: '100%',
          visibility: showWebView ? 'visible' : 'hidden',
        }}
        src="https://e.duboku.fun/vodplay/1953-1-15.html"
        onDidFinishLoad={handleLoad}
        devtools
        plugins
      />
    </main>
  );
}
