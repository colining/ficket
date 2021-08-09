import React, { useEffect, useState, MouseEvent, useContext } from 'react';
import {
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  IconButton,
  Snackbar,
  Typography,
} from '@material-ui/core';
import AutoResponsive from 'autoresponsive-react';
import { useResizeDetector } from 'react-resize-detector';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import { useClipboard } from 'use-clipboard-copy';
import path from 'path';
import { read } from '../../utils/JsonUtils';
import SourceReminder from './source/SourceReminder';
import { deleteFavourite, readFavorites } from '../../utils/FavoriteUtils';
import VideoInfo from '../../model/VideoInfo';
import { WorkshopContext } from '../../utils/SteamWorksUtils';
import getVideoInfo, { getRecommendFromDouban } from '../../utils/SpiderUtils';
import BackdropContainer from '../BackdropContainer';

const useStyles = makeStyles({
  favourites: {
    marginTop: '16px',
  },
  root: {
    minWidth: 200,
    minHeight: 300,
  },
  recommendRoot: {
    minWidth: 150,
    minHeight: 215,
  },
  actionArea: {
    width: 200,
    height: 300,
  },
  actionAreaRecommend: {
    width: 150,
    height: 215,
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
const recommendStyle = {
  width: 150,
  height: 265,
  cursor: 'default',
  color: '#000000',
  fontSize: '80px',
  lineHeight: '100px',
  textAlign: 'center',
  fontWeight: 'bold',
  userSelect: 'none',
  overflow: 'hidden',
};

const tvShowTagArray = [
  {
    tag: 'us',
    title: '美剧',
  },
  {
    tag: 'anime',
    title: '日漫',
  },
];
export default function HomePage(props: any) {
  const [sources, setSources] = useState(read());
  const workshopContext = useContext(WorkshopContext);
  const [favorites, setFavourites] = useState(readFavorites());
  const { width, ref } = useResizeDetector();
  const [open, setOpen] = useState(false);
  const { setCurrentInfo, setPlaylists, setInfos } = props;
  const [openSnack, setOpenSnack] = useState(false);
  const [tvShowTag, setTvShowTag] = useState(tvShowTagArray[0]);

  const history = useHistory();
  const classes = useStyles();
  const clipboard = useClipboard();

  useEffect(() => {
    console.log(tvShowTag);
  }, [tvShowTag]);
  useEffect(() => {
    setSources(read());
    setFavourites(readFavorites());
  }, []);

  const handleClick = async (info: VideoInfo) => {
    setCurrentInfo(info);
    setPlaylists([]);
    history.push('/main/webview');
  };

  const handleDelete = (e: MouseEvent, info: any) => {
    deleteFavourite(info);
    setFavourites(readFavorites());
    e.stopPropagation();
  };

  const handleShare = (e: MouseEvent, videoInfo: any) => {
    clipboard.copy(videoInfo.videoUrl);
    setOpenSnack(true);
    e.stopPropagation();
  };

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
                alt="图片加载失败"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = path.join(
                    path.dirname(__dirname),
                    'assets',
                    'error.png'
                  );
                }}
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
                  <IconButton
                    aria-label="share"
                    onClick={(e: MouseEvent) => handleShare(e, videoInfo)}
                  >
                    <ShareIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
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
          itemMargin={25}
        >
          {renderItem(favorites)}
        </AutoResponsive>
      </div>
    );
  }
  const handleRecommendClick = async (searchKey: string) => {
    setOpen(true);
    const videoInfos = await getVideoInfo(
      searchKey,
      workshopContext.workshopSource.filter((source) => source.activeTag)
    );
    console.log('videoInfos', videoInfos);
    setInfos(videoInfos);
    setOpen(false);
    history.push('/main/searchResult');
  };

  const renderRecommendItem = (recommends: any) => {
    return recommends.map((recommend: any) => {
      return (
        // It' must be a style here otherwise there is a bug in production
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <div key={recommend.videoUrl} className="item" style={recommendStyle}>
          <Card className={classes.recommendRoot} variant="outlined">
            <CardActionArea
              onClick={() => handleRecommendClick(recommend.title)}
              className={classes.actionAreaRecommend}
            >
              <CardMedia
                className={recommend.cover ? '' : classes.errorImage}
                component="img"
                image={recommend.cover}
                alt="图片加载失败"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = path.join(
                    path.dirname(__dirname),
                    'assets',
                    'error.png'
                  );
                }}
              />
            </CardActionArea>
          </Card>
          <Typography align="center" variant="body1" color="primary">
            {recommend.title}
          </Typography>
          <Typography align="center" variant="body1" color="secondary">
            {recommend.rate}
          </Typography>
        </div>
      );
    });
  };

  function renderRecommend() {
    const recommends = getRecommendFromDouban();
    return (
      <div ref={ref} style={{ marginTop: '20px' }}>
        <AutoResponsive
          containerWidth={width}
          itemClassName="item"
          transitionDuration=".5"
          transitionTimingFunction="easeIn"
          itemMargin={15}
        >
          {renderRecommendItem(recommends.get(tvShowTag.tag).subjects)}
        </AutoResponsive>
      </div>
    );
  }

  const handleClose = () => {
    setOpenSnack(false);
  };

  return (
    <div>
      {workshopContext.loadSuccess ? (
        <SourceReminder
          sources={workshopContext.workshopSource.concat(sources)}
        />
      ) : (
        ''
      )}

      <div className={classes.favourites}>
        <Typography variant="h5">我的收藏</Typography>
        {renderFavorites()}
      </div>
      <Divider />
      <br />
      <div>
        <Typography variant="h5" style={{ float: 'left' }}>
          推荐
        </Typography>
        {tvShowTagArray.map((tag) => (
          <Chip
            key={tag.title}
            label={tag.title}
            color={tag === tvShowTag ? 'primary' : 'default'}
            style={{ marginLeft: '20px' }}
            onMouseEnter={() => {
              console.log(tag);
              setTvShowTag(tag);
            }}
          />
        ))}
        {renderRecommend()}
      </div>
      <Snackbar
        open={openSnack}
        onClose={handleClose}
        autoHideDuration={2000}
        message="已复制到剪切板，快去分享一下吧"
      />
      <BackdropContainer
        open={open}
        onClick={() => {
          setOpen(false);
        }}
        message="搜索中....请稍后"
      />
    </div>
  );
}
