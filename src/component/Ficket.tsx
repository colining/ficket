import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainContainer from './MainContainer';
import DrawerContainer from './DrawerContainer';
import AppBarContainer from './AppBarContainer';
import getVideoInfo from '../utils/spider';
import BackdropContainer from './BackdropContainer';
import { WorkshopContext } from '../utils/SteamWorks';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
  },
});

export default function Ficket(props: any) {
  const classes = useStyles();
  const workshopContext = useContext(WorkshopContext);
  const [infos, setInfos] = useState(new Array<any>());
  const [playlists, setPlaylists] = useState([]);
  const [currentInfo, setCurrentInfo] = useState({});
  const [open, setOpen] = useState(false);

  const handleCurrentInfoChange = (info: any) => {
    setCurrentInfo(info);
  };

  const keyPress = async (e: any) => {
    if (e.keyCode !== 13) {
      return;
    }
    setOpen(true);
    const searchKey = e.target.value;
    const videoInfos = await getVideoInfo(
      searchKey,
      workshopContext.workshopSource
    );
    console.log('videoInfos', videoInfos);
    setInfos(videoInfos);
    setOpen(false);
    props.history.push('/main/searchResult');
  };

  return (
    <div className={classes.root}>
      <AppBarContainer keyPress={keyPress} />
      <DrawerContainer
        playlists={playlists}
        currentInfo={currentInfo}
        changeCurrentInfo={handleCurrentInfoChange}
      />
      <MainContainer
        infos={infos}
        setPlaylists={setPlaylists}
        playlists={playlists}
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
