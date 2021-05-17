import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import path from 'path';
import _ from 'lodash';
import { getPlaylist } from '../utils/spider';
import BackdropContainer from './BackdropContainer';

const useStyles = makeStyles({
  detail: {
    margin: '16px',
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
  li: {
    display: 'inline-block',
    margin: '5px 5px',
  },
  button: {
    width: '120px',
  },
});

export default function VideoDetail(props: any) {
  const { playlists, setPlaylists } = props;

  const { info } = props;

  const classes = useStyles();

  const history = useHistory();

  const { setCurrentInfo } = props;

  const [open, setOpen] = useState(true);

  async function getList() {
    setPlaylists([]);
    const list = await getPlaylist(
      info.videoDetail,
      info.videoSource,
      info.videoPlaylistContainerRegex,
      info.videoPlaylistRegex
    );
    console.log(list);
    setPlaylists(list);
  }

  useEffect(() => {
    getList()
      .then(() => setOpen(false))
      .catch((e) => console.log(e));
  }, []);

  const handleClick = (href: string, index: number, episode: number) => {
    const changedInfo = info;
    changedInfo.videoUrl =
      href === info.videoDetail ? playlists[0][0].href : href;
    changedInfo.activeEpisode = episode;
    setCurrentInfo(changedInfo);
    const list = _.clone(playlists);
    list.activeIndex = index;
    list.activeEpisode = episode;
    setPlaylists(list);
    history.push('/main/webview');
  };

  const renderPlaylistItem = (playlist: any, index: number) => {
    return playlist.map((i: any, episode: number) => {
      return (
        <li className={classes.li} key={i.href}>
          <Button
            className={classes.button}
            variant="contained"
            onClick={() => handleClick(i.href, index, episode)}
          >
            {i.title}
          </Button>
        </li>
      );
    });
  };
  const renderPlaylists = () => {
    if (!open && _.isEmpty(playlists[0])) {
      return <div>获取选集失败，请使用其他源</div>;
    }
    return playlists.map((playlist: any, index: number) => {
      return (
        <div key={playlist[0].href}>
          <h4>源: {index + 1}</h4>
          {renderPlaylistItem(playlist, index)}
        </div>
      );
    });
  };
  return (
    <div className={classes.detail}>
      <div
        key={info.videoUrl}
        className={classes.item}
        style={{ width: 400, height: 600 }}
      >
        <Card>
          <CardActionArea onClick={() => handleClick(info.videoUrl, 0, 0)}>
            <CardMedia
              component="img"
              image={info.imgUrl}
              alt="Contemplative Reptile"
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
              <Typography gutterBottom variant="h5" component="h2">
                {info.title}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
      <div>
        <ul>{renderPlaylists()}</ul>
      </div>
      <BackdropContainer
        open={open}
        onClick={() => {
          setOpen(false);
        }}
        message="获取选集中"
      />
    </div>
  );
}
