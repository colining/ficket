import WebView from 'react-electron-web-view';
import React, { useRef, useState } from 'react';
import { removeAllUnusedNode } from '../utils/utils';

export default function WebViewContainer(props: any) {
  const webView = useRef(WebView);
  const [showWebView, setShowWebView] = useState(false);

  const { info } = props;
  const handleLoad = () => {
    webView.current.openDevTools();
    console.log(info);
    // it's seems can inject the js function
    webView.current.executeJavaScript(removeAllUnusedNode);
    webView.current.executeJavaScript(`clear_html('${info.videoRegex}')`);
    setShowWebView(true);
  };

  return (
    <WebView
      ref={webView}
      style={{
        height: '100%',
        visibility: showWebView ? 'visible' : 'hidden',
      }}
      src={info.href}
      onDidFinishLoad={handleLoad}
      devtools
      plugins
    />
  );
}
