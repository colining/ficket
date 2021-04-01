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

const style = {
  height: 'auto',
  width: 'auto',
  cursor: 'default',
  color: '#514713',
  fontSize: '80px',
  lineHeight: '100px',
  textAlign: 'center',
  fontWeight: 'bold',
  textShadow: '1px 1px 0px #ab9a3c',
  userSelect: 'none',
};
const useStyles = makeStyles({
  root: {
    minWidth: 200,
    minHeight: 300,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  media: {
    height: 140,
    objectFit: 'cover',
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
});
export default function VideoGridList(props: any) {
  const [arrayList] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [itemMargin] = useState(10);
  const [horizontalDirection] = useState('left');
  const [verticalDirection] = useState('top');
  const [containerHeight] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);

  const container = useRef(AutoResponsive);

  const { infos } = props;

  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const renderItems = (infos: any) => {
    console.log('infos', infos);
    return infos.map(function (i: any, index: number) {
      return (
        // <div className="item" style={style} key={index}>
        //   <img src={i.imgUrl} />
        // </div>
        <div className="item" style={style} key={index}>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                component="img"
                image={i.imgUrl}
                title="here is title"
                alt="Contemplative Reptile"
              />
              <CardContent className={classes.cardTitle}>
                <Typography gutterBottom variant="h5" component="h2">
                  {i.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      );
    });
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
    console.log('here');
  }, [handleResize]);

  const getAutoResponsiveProps = () => {
    return {
      horizontalDirection,
      verticalDirection,
      itemMargin: 10,
      containerWidth,
      itemClassName: 'item',
      containerHeight,
      transitionDuration: '.8',
      transitionTimingFunction: 'linear',
    };
  };

  return (
    <AutoResponsive ref={container} {...getAutoResponsiveProps()}>
      {renderItems(infos)}
    </AutoResponsive>
  );
}
