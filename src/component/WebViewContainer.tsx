import WebView from 'react-electron-web-view';
import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { makeStyles } from '@material-ui/core/styles';
import { Fab, Snackbar, Typography } from '@material-ui/core';
import _ from 'lodash';
import path from 'path';
import BackdropContainer from './BackdropContainer';
import saveFavorite from '../utils/FavoriteUtils';
import { getPlaylist } from '../utils/spider';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
  },
  fab: {
    position: 'absolute',
    right: '1%',
    top: '120px',
  },
});

const preloadPath = path.join(path.dirname(__dirname), 'preload.js');

export default function WebViewContainer(props: any) {
  const webView = useRef(WebView);
  const [showWebView, setShowWebView] = useState(false);
  const [open, setOpen] = useState(true);
  const [muted, setMuted] = useState(true);
  const { info, playlists, setPlaylists } = props;
  const [openSnack, setOpenSnack] = useState(false);
  const handle = useFullScreenHandle();

  const classes = useStyles();

  useEffect(() => {
    setOpen(true);
    setShowWebView(false);
    setMuted(true);
  }, [info]);

  useEffect(() => {
    async function getList() {
      setPlaylists([]);
      const list = await getPlaylist(
        info.videoDetail,
        info.videoSource,
        info.videoPlaylistContainerRegex,
        info.videoPlaylistRegex
      );
      setPlaylists(list);
    }
    if (_.isEmpty(playlists)) {
      console.log('jump from homepage');
      getList();
    }
  }, [info]);

  const addFavorite = () => {
    saveFavorite(info);
    setOpenSnack(true);
  };

  useEffect(() => {
    const saveFavourite = setTimeout(() => {
      addFavorite();
      console.log('saveFavorite');
    }, 300000);
    return () => clearTimeout(saveFavourite);
  }, [info]);

  const handleDomReady = async () => {
    console.log(info);
    webView.current.send('videoRegex', info.videoRegex);
    setOpen(false);
    setShowWebView(true);
    setMuted(false);
  };

  const handleClose = () => {
    setOpenSnack(false);
  };
  return (
    <div className={classes.root}>
      <Typography>若加载时间过长，建议重新选择视频来源</Typography>
      <FullScreen handle={handle} className={classes.root}>
        <WebView
          preload={preloadPath}
          muted={muted}
          ref={webView}
          style={{
            height: '100%',
            visibility: showWebView ? 'visible' : 'hidden',
          }}
          src={info.videoUrl}
          onDomReady={handleDomReady}
          onEnterHtmlFullScreen={handle.enter}
          onLeaveHtmlFullScreen={handle.exit}
          onIpcMessage={(event: any) => {
            console.log(event.channel);
          }}
          devtools
          plugins
        />
        <BackdropContainer
          open={open}
          onClick={() => {
            setOpen(false);
          }}
          message="loading...."
        />
      </FullScreen>
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={addFavorite}
      >
        收藏
      </Fab>
      <Snackbar
        open={openSnack}
        onClose={handleClose}
        autoHideDuration={2000}
        message="已收藏，你可以回到主页浏览自己的收藏"
      />
    </div>
  );
}
