import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { Button, ButtonGroup, Divider } from '@material-ui/core';
import { Route, Switch, useHistory } from 'react-router-dom';
import VideoGridList from './VidoeGridList';
import WebViewContainer from './WebViewContainer';
import SourceContainer from './SourceContainer';
import VideoDetail from './VideoDetail';
import HomePage from './HomePage';

const useStyles = makeStyles({
  content: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  buttonGroup: {
    position: 'absolute',
    zIndex: 1001,
  },
  container: {
    marginTop: '50px',
    padding: '16px',
    width: '100%',
    height: '100%',
  },
});

export default function MainContainer(props: any) {
  const { currentInfo, setCurrentInfo } = props;
  const history = useHistory();
  const classes = useStyles();
  const { infos } = props;
  const { setPlaylist } = props;
  const { playlist } = props;

  return (
    <main className={classes.content}>
      <Toolbar />
      <ButtonGroup
        className={classes.buttonGroup}
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
                setPlaylist={setPlaylist}
                playlist={playlist}
              />
            )}
          />

          <Route
            path="/main/webview"
            render={() => (
              <WebViewContainer
                info={currentInfo}
                setPlaylist={setPlaylist}
                playlist={playlist}
              />
            )}
          />

          <Route path="/main/source" render={() => <SourceContainer />} />

          <Route
            path="/"
            render={() => (
              <HomePage
                setCurrentInfo={setCurrentInfo}
                setPlaylist={setPlaylist}
              />
            )}
          />
        </Switch>
      </div>
    </main>
  );
}
