import AutoResponsive from 'autoresponsive-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
    height: 'auto',
    width: 'auto',
  },
});
export default function VideoGridList(props: any) {
  const [containerWidth, setContainerWidth] = useState(null);

  const container = useRef(AutoResponsive);

  const { infos, setCurrentInfo } = props;

  const classes = useStyles();

  const handleClick = (info: VideoInfo) => {
    console.log('current info is ', info);
    setCurrentInfo(info);
    props.history.push('/main/webview');
  };

  const handleResize = useCallback(() => {
    console.log('rezise');
    if (container.current && container.current.offsetWidth) {
      try {
        setContainerWidth(container.current.offsetWidth);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, [handleResize]);

  const getAutoResponsiveProps = () => {
    return {
      horizontalDirection: 'left',
      verticalDirection: 'top',
      itemMargin: 10,
      containerWidth,
      itemClassName: 'item',
      containerHeight: null,
      transitionDuration: '.8',
      transitionTimingFunction: 'linear',
    };
  };

  const renderItems = () => {
    console.log('props', props);
    return infos.map((videoInfo: VideoInfo) => {
      return (
        // todo 'style={{}}' can't delete it's seems because the css order
        <div className={classes.item} key={videoInfo.href} style={{}}>
          <Card className={classes.root}>
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
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <AutoResponsive ref={container} {...getAutoResponsiveProps()}>
      {renderItems()}
    </AutoResponsive>
  );
}
