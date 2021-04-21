import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainContainer from './MainContainer';
import DrawerContainer from './DrawerContainer';
import AppBarContainer from './AppBarContainer';
import getVideoInfo from '../utils/spider';
import VideoInfo from '../utils/VideoInfo';
import BackdropContainer from './BackdropContainer';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
  },
});

export default function Ficket(props: any) {
  const classes = useStyles();
  const [infos, setInfos] = useState(new Array<Array<VideoInfo>>());
  const [playlist, setPlaylist] = useState([]);
  const [currentInfo, setCurrentInfo] = useState({});
  const [open, setOpen] = useState(false);

  const handleCurrentInfoChange = (info: any) => {
    setCurrentInfo(info);
  };

  const keyPress = async (e: any) => {
    if (e.keyCode !== 13) {
      return;
    }
    setInfos([]);
    setOpen(true);
    const searchKey = e.target.value;
    const videoInfos = await getVideoInfo(searchKey);
    console.log('videoInfos', videoInfos);
    setInfos(videoInfos);
    setOpen(false);
    props.history.push('/main/searchResult');
  };

  return (
    <div className={classes.root}>
      <AppBarContainer keyPress={keyPress} />
      <DrawerContainer
        playlist={playlist}
        currentInfo={currentInfo}
        changeCurrentInfo={handleCurrentInfoChange}
      />
      <MainContainer
        infos={infos}
        setPlaylist={setPlaylist}
        playlist={playlist}
        currentInfo={currentInfo}
        setCurrentInfo={handleCurrentInfoChange}
      />
      <BackdropContainer
        open={open}
        onClick={() => {
          setOpen(false);
        }}
        message="search...."
      />
    </div>
  );
}
