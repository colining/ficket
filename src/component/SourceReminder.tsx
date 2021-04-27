import { Card, CardMedia, Divider } from '@material-ui/core';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import _ from 'lodash';
import path from 'path';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    media: {
      height: 200,
      width: 200,
      margin: 'auto',
    },
  })
);

export default function SourceReminder(props: any) {
  const classes = useStyles();
  const { sources } = props;

  const renderSourceRemind = () => {
    if (_.isEmpty(sources)) {
      return (
        <div>
          <h4>没有发现可用的源，请扫描二维码添加源</h4>
          <Card className={classes.root}>
            <CardMedia
              className={classes.media}
              component="img"
              image={path.join(path.dirname(__dirname), 'assets', 'qrcode.png')}
              title="Contemplative Reptile"
            />
          </Card>
          <Divider />
        </div>
      );
    }
    return null;
  };

  return renderSourceRemind();
}
