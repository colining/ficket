import React, { useRef, useState } from 'react';
import WebView from 'react-electron-web-view';
import InputBase from '@material-ui/core/InputBase';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Divider, IconButton, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '20%',
      marginRight: '20%',
      marginBottom: '2ch',
      marginTop: '2ch',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    fullScreen: {
      width: '100%',
      height: '100%',
    },
  })
);
const playM3u8Prefix = 'https://www.playm3u8.cn/jiexi.php?url=';
export default function Parsing() {
  const classes = useStyles();
  const [value, setValue] = useState('');
  const webView = useRef(WebView);
  const handle = useFullScreenHandle();
  const [url, setUrl] = useState('http://www.baidu.com');

  const keyPress = (e: any) => {
    if (e.keyCode && e.keyCode !== 13) {
      return;
    }
    setUrl(playM3u8Prefix + e.target.value);
  };
  const handleClick = (event: any) => {
    setUrl(playM3u8Prefix + value);
    event.preventDefault();
  };
  return (
    <div style={{ height: '100%' }}>
      <Paper className={classes.root}>
        <InputBase
          value={value}
          className={classes.input}
          placeholder="请输入视频链接地址"
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyDown={keyPress}
        />
        <IconButton
          onClick={(event) => handleClick(event)}
          className={classes.iconButton}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      <Divider />
      <div style={{ height: '95%' }}>
        <FullScreen handle={handle} className={classes.fullScreen}>
          <WebView
            ref={webView}
            src={url}
            allowpopups
            style={{
              height: '100%',
            }}
            onEnterHtmlFullScreen={() => {
              handle.enter();
            }}
            onLeaveHtmlFullScreen={() => {
              handle.exit();
            }}
          />
        </FullScreen>
      </div>
    </div>
  );
}
