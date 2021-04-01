import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MainContainer from './MainContainer';
import DrawerContainer from './DrawerContainer';
import AppBarContainer from './AppBarContainer';
import getVideoInfo from '../utils/spider';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      height: 'inherit',
      width: 'inherit',
    },
  })
);

export default function Ficket() {
  const classes = useStyles();
  const [src] = useState('https://e.duboku.fun/vodplay/1953-1-15.html');
  const [infos, setInfos] = useState([]);

  const keyPress = async (e: any) => {
    if (e.keyCode !== 13) {
      return;
    }
    console.log('value', e.target.value);
    const videoInfos = await getVideoInfo(
      e.target.value,
      'https://www.duboku.tv/',
      'https://www.duboku.tv/vodsearch/-------------.html?wd=',
      'a.btn.btn-sm.btn-warm',
      'div.thumb > a',
      'div.detail > h4 > a'
    );
    console.log('a', videoInfos);
    setInfos(videoInfos);
  };

  return (
    <div className={classes.root}>
      <AppBarContainer keyPress={keyPress} />
      <DrawerContainer />
      <MainContainer src={src} infos={infos} />
    </div>
  );
}
