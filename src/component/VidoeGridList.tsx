import AutoResponsive from 'autoresponsive-react';
import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useResizeDetector } from 'react-resize-detector';
import VideoInfo from '../utils/VideoInfo';

const useStyles = makeStyles({
  root: {
    minWidth: 200,
    minHeight: 300,
  },
  cardTitle: {
    zIndex: 2,
    position: 'absolute',
    background: 'cornsilk',
    opacity: 0.8,
    width: '100%',
    margin: 'auto',
    bottom: 0,
  },
  item: {
    cursor: 'default',
    color: '#514713',
    fontSize: '80px',
    lineHeight: '100px',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadow: '1px 1px 0px #ab9a3c',
    userSelect: 'none',
  },
});
export default function VideoGridList(props: any) {
  const { width, ref } = useResizeDetector();

  const { infos, setCurrentInfo } = props;

  const classes = useStyles();

  const handleClick = (info: VideoInfo) => {
    console.log('current info is ', info);
    setCurrentInfo(info);
    props.history.push('/main/webview');
  };

  const renderItems = (info: any) => {
    console.log('props', props);
    return info.map((videoInfo: VideoInfo) => {
      return (
        <div
          key={videoInfo.videoUrl}
          className={classes.item}
          style={{ width: 200, height: 300 }}
        >
          <Card>
            <CardActionArea onClick={() => handleClick(videoInfo)}>
              <CardMedia
                component="img"
                image={videoInfo.imgUrl}
                title="here is title"
                alt="Contemplative Reptile"
              />
              <CardContent className={classes.cardTitle}>
                <Typography gutterBottom variant="h5" component="h2">
                  {videoInfo.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      );
    });
  };

  return infos.map((info: any) => {
    return (
      <div ref={ref} key={info}>
        <h4>以下结果来自：{info[0].videoSource}</h4>
        <AutoResponsive
          containerWidth={width}
          itemClassName="item"
          transitionDuration=".5"
          transitionTimingFunction="easeIn"
          itemMargin={15}
        >
          {renderItems(info)}
        </AutoResponsive>
        <Divider />
      </div>
    );
  });
}
