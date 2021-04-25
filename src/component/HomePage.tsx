import React, { useEffect, useState } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import AutoResponsive from 'autoresponsive-react';
import { useResizeDetector } from 'react-resize-detector';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { read } from '../utils/JsonUtils';
import SourceReminder from './SourceReminder';
import { readFavorites } from '../utils/FavoriteUtils';
import VideoInfo from '../utils/VideoInfo';
import { getPlaylist } from '../utils/spider';

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
  errorImage: {
    height: 300,
    width: 200,
  },
});
const style = {
  width: 200,
  height: 300,
  cursor: 'default',
  color: '#514713',
  fontSize: '80px',
  lineHeight: '100px',
  textAlign: 'center',
  fontWeight: 'bold',
  textShadow: '1px 1px 0px #ab9a3c',
  userSelect: 'none',
};

export default function HomePage(props: any) {
  const [sources, setSources] = useState(read());
  const [favorites, setFavourites] = useState(readFavorites());
  const { width, ref } = useResizeDetector();
  const { setCurrentInfo } = props;
  const { setPlaylist } = props;

  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    setSources(read());
    setFavourites(readFavorites());
  }, []);

  const handleClick = async (info: VideoInfo) => {
    setCurrentInfo(info);
    const list = await getPlaylist(
      info.videoDetail,
      info.videoSource,
      info.videoPlaylistRegex
    );
    setPlaylist(list);
    history.push('/main/webview');
  };

  const renderItem = (favourites: any) => {
    return favourites.map((videoInfo: VideoInfo) => {
      return (
        // It' must be a style here otherwise there is a bug in production
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <div key={videoInfo.videoUrl} className="item" style={style}>
          <Card className={classes.root} variant="outlined">
            <CardActionArea onClick={() => handleClick(videoInfo)}>
              <CardMedia
                className={videoInfo.imgUrl ? '' : classes.errorImage}
                component="img"
                image={videoInfo.imgUrl}
                title="here is title"
                alt="图片加载失败"
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

  function renderFavorites() {
    if (favorites.length === 0) {
      return (
        <div>
          <h4>还没有收藏任何视频</h4>
          <h4>快去收藏写视频吧</h4>
        </div>
      );
    }
    return (
      <div ref={ref}>
        <AutoResponsive
          containerWidth={width}
          itemClassName="item"
          transitionDuration=".5"
          transitionTimingFunction="easeIn"
          itemMargin={15}
        >
          {renderItem(favorites)}
        </AutoResponsive>
      </div>
    );
  }

  return (
    <div>
      <h4>我的收藏</h4>
      <SourceReminder sources={sources} />
      {renderFavorites()}
    </div>
  );
}
