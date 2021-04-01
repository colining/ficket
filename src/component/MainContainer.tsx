import React, { useRef, useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import WebView from 'react-electron-web-view';
import { Divider } from '@material-ui/core';
import myMap from '../utils/utils';
import VideoGridList from './VidoeGridList';

const useStyles = makeStyles(() =>
  createStyles({
    content: {
      flexGrow: 1,
    },
  })
);

export default function MainContainer(props: any) {
  const webView = useRef(WebView);
  const [showWebView, setShowWebView] = useState(false);
  const classes = useStyles();
  const { src } = props;
  const { infos } = props;

  const handleLoad = () => {
    console.log(webView.current);
    console.log(myMap.get('https://e.duboku.fun/'));
    console.log(src);
    webView.current.executeJavaScript(
      "console.log('这里需要判别使用那段脚本')"
    );
    setShowWebView(false);
  };

  return (
    <main className={classes.content}>
      <Toolbar />
      <Divider />
      <VideoGridList infos={infos} />

      <WebView
        ref={webView}
        style={{
          height: '100%',
          visibility: showWebView ? 'visible' : 'hidden',
        }}
        src={src}
        onDidFinishLoad={handleLoad}
        devtools
        plugins
      />
    </main>
  );
}
