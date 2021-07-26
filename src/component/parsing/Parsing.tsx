import React, { useState } from 'react';
import WebView from 'react-electron-web-view';
import InputBase from '@material-ui/core/InputBase';
import {
  createStyles,
  fade,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.black, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.black, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('xs')]: {
        width: '20ch',
        '&:focus': {
          width: '30ch',
        },
      },
      [theme.breakpoints.between('sm', 'lg')]: {
        width: '60ch',
        '&:focus': {
          width: '70ch',
        },
      },
      [theme.breakpoints.up('xl')]: {
        width: '100ch',
        '&:focus': {
          width: '150ch',
        },
      },
    },
  })
);
const playM3u8Prefix = 'https://www.playm3u8.cn/jiexi.php?url=';
export default function Parsing() {
  const classes = useStyles();
  const [url, setUrl] = useState('http://www.baidu.com');

  const keyPress = (e: any) => {
    if (e.keyCode !== 13) {
      return;
    }

    setUrl(playM3u8Prefix + e.target.value);
  };
  return (
    <div>
      <div className={classes.search}>
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          onKeyDown={keyPress}
        />
      </div>
      <WebView
        src={url}
        style={{
          height: '100%',
        }}
      />
    </div>
  );
}
