import WebView from 'react-electron-web-view';
import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { makeStyles } from '@material-ui/core/styles';
import { removeAllUnusedNode } from '../utils/utils';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
  },
});

export default function WebViewContainer(props: any) {
  const webView = useRef(WebView);
  const [showWebView, setShowWebView] = useState(false);
  const { info } = props;
  const handle = useFullScreenHandle();

  const classes = useStyles();

  useEffect(() => {
    setShowWebView(false);
  }, [info]);

  const handleLoad = async () => {
    webView.current.openDevTools();
    console.log(info);
    // it's seems can inject the js function
    webView.current.executeJavaScript(removeAllUnusedNode);
    webView.current.executeJavaScript(`clear_html('${info.videoRegex}')`);
    setShowWebView(true);
  };

  return (
    <FullScreen handle={handle} className={classes.root}>
      <WebView
        ref={webView}
        style={{
          height: '100%',
          visibility: showWebView ? 'visible' : 'hidden',
        }}
        src={info.videoUrl}
        onDidFinishLoad={handleLoad}
        onEnterHtmlFullScreen={handle.enter}
        onLeaveHtmlFullScreen={handle.exit}
        devtools
        plugins
      />
    </FullScreen>
  );
}
