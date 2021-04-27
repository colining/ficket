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
import { getPlaylist } from '../utils/spider';
import BackdropContainer from './BackdropContainer';

const useStyles = makeStyles({
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
  const { playlist, setPlaylist } = props;

  const { info } = props;

  const classes = useStyles();

  const history = useHistory();

  const { setCurrentInfo } = props;

  const [open, setOpen] = useState(true);

  useEffect(() => {
    async function getList() {
      setPlaylist([]);
      const list = await getPlaylist(
        info.videoDetail,
        info.videoSource,
        info.videoPlaylistRegex
      );
      setPlaylist(list);
    }
    getList()
      .then(() => setOpen(false))
      .catch((e) => console.log(e));
  }, []);

  const handleClick = (href: string) => {
    const changedInfo = info;
    changedInfo.videoUrl = href;
    setCurrentInfo(changedInfo);
    history.push('/main/webview');
  };

  const renderPlaylist = () => {
    return playlist.map((i: any) => {
      return (
        <li className={classes.li} key={i.title}>
          <Button
            className={classes.button}
            variant="contained"
            onClick={() => handleClick(i.href)}
          >
            {i.title}
          </Button>
        </li>
      );
    });
  };
  return (
    <div>
      <div
        key={info.videoUrl}
        className={classes.item}
        style={{ width: 400, height: 600 }}
      >
        <Card>
          <CardActionArea onClick={() => handleClick(info.videoUrl)}>
            <CardMedia
              component="img"
              image={info.imgUrl}
              title="here is title"
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
        <ul>{renderPlaylist()}</ul>
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
