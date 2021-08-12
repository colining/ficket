import AutoResponsive from 'autoresponsive-react';
import React, { useEffect, useState } from 'react';
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
import _ from 'lodash';
import path from 'path';
import InfiniteScroll from 'react-infinite-scroller';
import asyncPool from 'tiny-async-pool';
import VideoInfo from '../../model/VideoInfo';

const useStyles = makeStyles({
  root: {
    minWidth: 200,
    minHeight: 300,
  },
  cardActionArea: {
    width: '200px',
    height: '300px',
  },
  cardTitle: {
    zIndex: 2,
    position: 'absolute',
    background: 'cornsilk',
    opacity: 0.8,
    width: '100%',
    maxHeight: '20ch',
    margin: 'auto',
    bottom: 0,
  },
  errorImage: {
    height: 300,
    width: 200,
  },
  loader: {
    animation: '$gradientAnimation 2s linear infinite',
    background: 'linear-gradient(45deg, #298fee, #11c958, #a120bb, #d6612a)',
    backgroundSize: '600% 600%',
    color: '#fff',
    padding: '8px',
  },
  '@keyframes gradientAnimation': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
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

export default function VideoGridList(props: any) {
  const { width, ref } = useResizeDetector();
  const [searchResult, setSearchResult] = useState(Array<any>());
  const [tracks, setTracks] = useState(Array<any>());
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const { infos, setCurrentInfo } = props;
  const classes = useStyles();

  let items = new Array<any>();

  const handleClick = (info: VideoInfo) => {
    console.log('current info is ', info);
    setCurrentInfo(info);
    // todo just a temp solution
    if (_.isEmpty(info.videoDetail)) {
      props.history.push('/main/webview');
    } else {
      props.history.push('/main/videoDetail');
    }
  };

  useEffect(() => {
    items = [];
    setTracks([]);
    setSearchResult([]);
    setHasMoreItems(true);
    (async function () {
      const loadSearchResult = (i: any) => {
        return i
          .then((v: any) => {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            return setSearchResult((test: any) => [...test, v]);
          })
          .catch((e: any) => {
            console.log('setTest发生错误', e);
            return setSearchResult((test: any) => [...test, undefined]);
          });
      };
      await asyncPool(4, infos, loadSearchResult);
    })();
  }, [infos]);

  useEffect(() => {
    console.log('infos', infos);
  }, [infos]);

  const renderItem = (info: any) => {
    return info.map((videoInfo: VideoInfo) => {
      return (
        // It' must be a style here otherwise there is a bug in production
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <div key={videoInfo.videoUrl} className="item" style={style}>
          <Card className={classes.root} variant="outlined">
            <CardActionArea
              className={classes.cardActionArea}
              onClick={() => handleClick(videoInfo)}
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

  const loadMoreSearchResult = () => {
    if (infos.length === tracks.length) {
      setHasMoreItems(false);
    } else if (
      !_.isEmpty(searchResult) &&
      searchResult.length > tracks.length
    ) {
      setTracks([...tracks, searchResult[tracks.length]]);
    } else {
      setTracks(tracks);
      setHasMoreItems(true);
    }
  };

  const renderItems = () => {
    tracks.forEach((track: any) => {
      if (track && !_.isEmpty(track.result)) {
        items.push(
          <div key={track.videoSource}>
            <h4 style={{ display: 'inline-block' }}>
              以下结果来自：{track.videoSource}
            </h4>
            <AutoResponsive
              containerWidth={width}
              itemClassName="item"
              transitionDuration=".5"
              transitionTimingFunction="easeIn"
              itemMargin={15}
            >
              {renderItem(track.result)}
            </AutoResponsive>
            <Divider />
          </div>
        );
      }
    });
    return <div ref={ref}>{items}</div>;
  };
  return (
    <InfiniteScroll
      pageStart={0}
      threshold={250}
      loadMore={loadMoreSearchResult}
      hasMore={hasMoreItems}
      useWindow={false}
      loader={
        hasMoreItems ? (
          <div className={classes.loader} key={tracks.length}>
            Loading ...
          </div>
        ) : (
          <div />
        )
      }
    >
      {renderItems()}
      {hasMoreItems ? (
        ''
      ) : (
        <Typography variant="h4" align="center" style={{ marginTop: '1ch' }}>
          下面木有了呦~
        </Typography>
      )}
    </InfiniteScroll>
  );
}
