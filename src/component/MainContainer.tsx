import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import VideoGridList from './VidoeGridList';
import WebViewContainer from './WebViewContainer';
import Source from './Source';
import VideoDetail from './VideoDetail';

const useStyles = makeStyles({
  content: {
    flexGrow: 1,
    overflowY: 'auto',
  },
});

export default function MainContainer(props: any) {
  const { currentInfo, setCurrentInfo } = props;

  const classes = useStyles();
  const { infos } = props;
  const { setPlaylist } = props;
  const { playlist } = props;

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
              setCurrentInfo={setCurrentInfo}
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              {...routeProps}
            />
          )}
        />
        <Route
          path="/main/videoDetail"
          render={() => (
            <VideoDetail
              info={currentInfo}
              setCurrentInfo={setCurrentInfo}
              setPlaylist={setPlaylist}
              playlist={playlist}
            />
          )}
        />

        <Route
          path="/main/webview"
          render={() => (
            <WebViewContainer info={currentInfo} setPlaylist={setPlaylist} />
          )}
        />

        <Route path="/main/source" render={() => <Source />} />

        <Route path="/" render={() => <h1>首页还在施工中</h1>} />
      </Switch>
    </main>
  );
}
