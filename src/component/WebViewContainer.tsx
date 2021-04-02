import WebView from 'react-electron-web-view';
import React, { useRef, useState } from 'react';
import myMap from '../utils/utils';

export default function WebViewContainer(props: any) {
  const webView = useRef(WebView);
  const [showWebView, setShowWebView] = useState(false);

  const { src } = props;

  const handleLoad = () => {
    console.log(22222);
    console.log(webView.current);
    console.log(myMap.get('https://e.duboku.fun/'));
    console.log(src);
    webView.current.executeJavaScript(myMap.get('https://e.duboku.fun/'));
    setShowWebView(true);
  };

  return (
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
  );
}
