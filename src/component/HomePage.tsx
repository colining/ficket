import React, { useEffect, useState, MouseEvent } from 'react';
import {
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@material-ui/core';
import AutoResponsive from 'autoresponsive-react';
import { useResizeDetector } from 'react-resize-detector';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import { read } from '../utils/JsonUtils';
import SourceReminder from './SourceReminder';
import { deleteFavourite, readFavorites } from '../utils/FavoriteUtils';
import VideoInfo from '../utils/VideoInfo';

const useStyles = makeStyles({
  root: {
    minWidth: 200,
    minHeight: 300,
  },
  actionArea: {
    width: 200,
    height: 300,
  },
  cardTitle: {
    padding: '8px 0px 0px 8px',
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
  button: {
    float: 'right',
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
  const { setCurrentInfo, setPlaylist } = props;

  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    setSources(read());
    setFavourites(readFavorites());
  }, []);

  const handleClick = async (info: VideoInfo) => {
    setCurrentInfo(info);
    setPlaylist([]);
    history.push('/main/webview');
  };

  function handleDelete(e: MouseEvent, info: any) {
    deleteFavourite(info);
    setFavourites(readFavorites());
    e.stopPropagation();
  }

  const renderItem = (favourites: any) => {
    return favourites.map((videoInfo: VideoInfo) => {
      return (
        // It' must be a style here otherwise there is a bug in production
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <div key={videoInfo.videoUrl} className="item" style={style}>
          <Card className={classes.root} variant="outlined">
            <CardActionArea
              onClick={() => handleClick(videoInfo)}
              className={classes.actionArea}
            >
              <CardMedia
                className={videoInfo.imgUrl ? '' : classes.errorImage}
                component="img"
                image={videoInfo.imgUrl}
                title="here is title"
                alt="图片加载失败"
              />
              <CardContent className={classes.cardTitle}>
                <Typography align="left" variant="h6" component="h1">
                  {videoInfo.title}
                </Typography>
                <ButtonGroup
                  className={classes.button}
                  orientation="horizontal"
                  color="primary"
                  aria-label="vertical outlined primary button group"
                >
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                  <IconButton
                    aria-label="add to favorites"
                    onClick={(e: MouseEvent) => handleDelete(e, videoInfo)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ButtonGroup>
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
          <h4>快去收藏些视频吧</h4>
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
