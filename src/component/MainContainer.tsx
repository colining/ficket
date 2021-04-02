import React, { useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import VideoGridList from './VidoeGridList';
import WebViewContainer from './WebViewContainer';
import Source from './Source';

const useStyles = makeStyles({
  content: {
    flexGrow: 1,
    overflowY: 'auto',
  },
});

export default function MainContainer(props: any) {
  const [src, setSrc] = useState('');
  const classes = useStyles();
  const { infos } = props;

  const handleSrcChange = (url: string) => {
    setSrc(url);
  };

  return (
    <main className={classes.content}>
      <Toolbar />
      <Divider />
      <Switch>
        <Route
          path="/main/searchResult"
          render={(routeProps) => (
            <VideoGridList
              infos={infos}
              setSrc={handleSrcChange}
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              {...routeProps}
            />
          )}
        />

        <Route
          path="/main/webview"
          render={() => <WebViewContainer src={src} />}
        />

        <Route path="/main/source" render={() => <Source />} />

        <Route path="/" render={() => <h1>首页还在施工中</h1>} />
      </Switch>
    </main>
  );
}
