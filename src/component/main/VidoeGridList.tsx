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

  const { infos, setCurrentInfo } = props;

  const classes = useStyles();

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
  const [finish, setFinish] = useState(false);
  const [test, setTest] = useState(Array<any>());
  useEffect(() => {
    (async function () {
      const timeout = (i: any) => {
        return i
          .then((v: any) => {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            return setTest((test: any) => [...test, v]);
          })
          .catch((e: any) => console.log(e));
      };
      await asyncPool(2, infos, timeout);
      setFinish(true);
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

  // function renderVideoInfo() {
  //   if (infos.length === 0) {
  //     return (
  //       <div>
  //         <h4>木有搜索结果</h4>
  //         <h4>请添加源，或者换个关键词</h4>
  //       </div>
  //     );
  //   }
  //   return infos.map((info: any) => {
  //     if (_.isEmpty(info.result)) {
  //       return '';
  //     }
  //     return (
  //       <div ref={ref} key={info.videoSource + info.workshopTag}>
  //         <h4>以下结果来自：{info.videoSource}</h4>
  //         <AutoResponsive
  //           containerWidth={width}
  //           itemClassName="item"
  //           transitionDuration=".5"
  //           transitionTimingFunction="easeIn"
  //           itemMargin={15}
  //         >
  //           {renderItem(info.result)}
  //         </AutoResponsive>
  //         <Divider />
  //       </div>
  //     );
  //   });
  // }
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [tracks, setTracks] = useState(Array<any>());
  const items = new Array<any>();
  // const loader = <div className="loader">Loading ...</div>;

  useEffect(() => {
    console.log('test', test);
  }, [test]);

  useEffect(() => {
    console.log('tracks', tracks);
  }, [tracks]);
  const loadItems = () => {
    console.log('loadItems');
    if (finish && _.isEmpty(test)) {
      setHasMoreItems(false);
    }
    console.log('loadItems', test);
    if (!_.isEmpty(test) && test.length > tracks.length) {
      setTracks([...tracks, test[tracks.length]]);
    }
  };

  const renderItems = () => {
    tracks.forEach((track: any) => {
      if (track && track.result) {
        items.push(
          <div ref={ref} key={track.videoSource}>
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
    return <div>{items}</div>;
  };
  return (
    <InfiniteScroll
      pageStart={0}
      threshold={250}
      loadMore={loadItems}
      hasMore={hasMoreItems}
      useWindow={false}
      loader={
        <div className="loader" key={0}>
          Loading ...
        </div>
      }
    >
      {renderItems()}
    </InfiniteScroll>
  );
}
