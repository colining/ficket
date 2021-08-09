import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Joyride, { ACTIONS, CallBackProps, STATUS } from 'react-joyride';
import { Fab } from '@material-ui/core';
import { Route } from 'react-router-dom';
import MainContainer from './MainContainer';
import DrawerContainer from './DrawerContainer';
import AppBarContainer from './AppBarContainer';
import getVideoInfo from '../utils/SpiderUtils';
import BackdropContainer from './BackdropContainer';
import { WorkshopContext } from '../utils/SteamWorksUtils';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
  },
  tour: {
    position: 'absolute',
    right: '1%',
    top: '120px',
  },
});

export default function Ficket(props: any) {
  const classes = useStyles();
  const workshopContext = useContext(WorkshopContext);
  const [infos, setInfos] = useState(new Array<any>());
  const [playlists, setPlaylists] = useState([]);
  const [currentInfo, setCurrentInfo] = useState({});
  const [open, setOpen] = useState(false);
  const [steps] = useState([
    {
      content: <h2>让我们开始Ficket 教程吧~</h2>,
      locale: { skip: <strong aria-label="skip">跳过</strong> },
      placement: 'center',
      target: 'body',
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: '#sourceButton',
      content: <h2>点击这里可以设置视频源</h2>,
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: '#sourceList',
      content: <h2>您可以在这里设置源，并设置是否启用</h2>,
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: '#root > div > div > header > div > div > div> input',
      content: <h2>在这里搜索您想看的剧</h2>,
      disableBeacon: true,
      hideCloseButton: true,
    },
  ]);
  const [run, setRun] = useState(false);

  const setPlayListsActiveIndex = (lists: any, index: number) => {
    lists.activeIndex = index;
    setPlaylists(lists);
  };

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
      workshopContext.workshopSource.filter((source) => source.activeTag)
    );
    console.log('videoInfos', videoInfos);
    setInfos(videoInfos);
    setOpen(false);
    props.history.push('/main/searchResult');
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRun(false);
    }
    if (action === ACTIONS.CLOSE) {
      setRun(false);
    }
    if (index === 1) {
      props.history.push('/main/source/list');
    }
    if (index === 3) {
      props.history.push('/');
    }
  };
  return (
    <div className={classes.root}>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        disableOverlayClose
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        steps={steps}
        spotlightClicks
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
        locale={{
          back: '返回',
          last: '结束',
          next: '下一步',
          skip: '跳过',
        }}
      />
      <AppBarContainer keyPress={keyPress} />
      <DrawerContainer
        playlists={playlists}
        currentInfo={currentInfo}
        changeCurrentInfo={handleCurrentInfoChange}
      />
      <MainContainer
        infos={infos}
        setInfos={setInfos}
        setPlaylists={setPlaylists}
        playlists={playlists}
        setPlayListsActiveIndex={setPlayListsActiveIndex}
        currentInfo={currentInfo}
        setCurrentInfo={handleCurrentInfoChange}
      />
      <BackdropContainer
        open={open}
        onClick={() => {
          setOpen(false);
        }}
        message="搜索中....请稍后"
      />
      <Route
        path={['/', '/main/source']}
        exact
        render={() => (
          <Fab
            color="primary"
            aria-label="add"
            className={classes.tour}
            onClick={() => setRun(true)}
          >
            教程
          </Fab>
        )}
      />
    </div>
  );
}
