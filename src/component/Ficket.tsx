import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainContainer from './MainContainer';
import DrawerContainer from './DrawerContainer';
import AppBarContainer from './AppBarContainer';
import getVideoInfo from '../utils/spider';
import VideoInfo from '../utils/VideoInfo';
import { read } from '../utils/JsonUtils';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
  },
});

export default function Ficket(props: any) {
  const classes = useStyles();
  const [infos, setInfos] = useState(new Array<VideoInfo>());

  const keyPress = async (e: any) => {
    if (e.keyCode !== 13) {
      return;
    }
    const searchKey = e.target.value;
    // todo  这里之后要写成异步请求
    const source = read('results.json')[0];
    const videoInfos = await getVideoInfo(
      searchKey,
      source.homePageUrl,
      source.searchUrlPrefix,
      source.videoUrlRegex,
      source.imgUrlRegex,
      source.titleRegex,
      source.videoRegex
    );
    console.log('videoInfos', videoInfos);
    setInfos(videoInfos);
    props.history.push('/main/searchResult');
  };

  return (
    <div className={classes.root}>
      <AppBarContainer keyPress={keyPress} />
      <DrawerContainer />
      <MainContainer infos={infos} />
    </div>
  );
}
