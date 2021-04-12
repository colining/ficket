import WebView from 'react-electron-web-view';
import React, { useEffect, useRef, useState } from 'react';
import { removeAllUnusedNode } from '../utils/utils';

export default function WebViewContainer(props: any) {
  const webView = useRef(WebView);
  const [showWebView, setShowWebView] = useState(false);
  const { info } = props;

  useEffect(() => {
    console.log('WebViewContainer');
    console.log('current info is ', info);
  });
  const handleLoad = async () => {
    webView.current.openDevTools();
    console.log(info);
    // it's seems can inject the js function
    webView.current.executeJavaScript(removeAllUnusedNode);
    webView.current.executeJavaScript(`clear_html('${info.videoRegex}')`);
    setShowWebView(true);
  };

  const handleFullScreen = () => {
    console.log('抓取全屏事件');
  };
  return (
    <WebView
      ref={webView}
      style={{
        height: '100%',
        visibility: showWebView ? 'visible' : 'hidden',
      }}
      src={info.videoUrl}
      onDidFinishLoad={handleLoad}
      onEnterHtmlFullScreen={handleFullScreen}
      devtools
      plugins
    />
  );
}
