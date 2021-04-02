import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainContainer from './MainContainer';
import DrawerContainer from './DrawerContainer';
import AppBarContainer from './AppBarContainer';
import getVideoInfo from '../utils/spider';
import VideoInfo from '../utils/VideoInfo';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
  },
});

export default function Ficket(props: any) {
  const classes = useStyles();
  const [src] = useState('https://e.duboku.fun/vodplay/1953-1-15.html');
  const [infos, setInfos] = useState(new Array<VideoInfo>());

  const keyPress = async (e: any) => {
    if (e.keyCode !== 13) {
      return;
    }
    const searchKey = e.target.value;
    const videoInfos = await getVideoInfo(
      searchKey,
      'https://www.duboku.tv/',
      'https://www.duboku.tv/vodsearch/-------------.html?wd=',
      'a.btn.btn-sm.btn-warm',
      'div.thumb > a',
      'div.detail > h4 > a'
    );
    console.log('videoInfos', videoInfos);
    setInfos(videoInfos);
    props.history.push('/main/searchResult');
  };

  return (
    <div className={classes.root}>
      <AppBarContainer keyPress={keyPress} />
      <DrawerContainer />
      <MainContainer src={src} infos={infos} />
    </div>
  );
}
