import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { Button, ButtonGroup, Divider } from '@material-ui/core';
import { Route, Switch, useHistory } from 'react-router-dom';
import VideoGridList from './main/VidoeGridList';
import WebViewContainer from './main/WebViewContainer';
import SourceContainer from './main/source/SourceContainer';
import VideoDetail from './main/VideoDetail';
import HomePage from './main/HomePage';
import AboutMe from './main/AboutMe';
import Book from './book/Book';

const useStyles = makeStyles({
  content: {
    flexGrow: 1,
  },
  container: {
    overflowY: 'auto',
    padding: '0px 0px 120px 16px;',
    width: '100%',
    height: '100%',
  },
});

export default function MainContainer(props: any) {
  const { currentInfo, setCurrentInfo } = props;
  const history = useHistory();
  const classes = useStyles();
  const { infos } = props;
  const { playlists, setPlaylists } = props;

  return (
    <main className={classes.content}>
      <Toolbar />
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
        fullWidth
      >
        <Button onClick={() => history.goBack()}>后退</Button>
        <Button onClick={() => history.goForward()}>前进</Button>
      </ButtonGroup>
      <Divider />
      <div className={classes.container}>
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
                setPlaylists={setPlaylists}
                playlists={playlists}
              />
            )}
          />

          <Route
            path="/main/webview"
            render={() => (
              <WebViewContainer
                info={currentInfo}
                setPlaylists={setPlaylists}
                playlists={playlists}
              />
            )}
          />

          <Route path="/main/source" render={() => <SourceContainer />} />
          <Route path="/main/about" component={AboutMe} />
          <Route path="/book" component={Book} />
          <Route
            path="/"
            render={() => (
              <HomePage
                setCurrentInfo={setCurrentInfo}
                setPlaylists={setPlaylists}
              />
            )}
          />
        </Switch>
      </div>
    </main>
  );
}
