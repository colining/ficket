import {
  Button,
  Card,
  CardMedia,
  Divider,
  Link,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import _ from 'lodash';
import path from 'path';
import { handleClickAndOpenUrlInLocal } from '../../../utils/utils';

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
          <h4>没有发现可用的源，您可以通过创意工坊或者扫码添加源</h4>
          <Typography>
            <Button
              component={Link}
              onClick={(e: any) =>
                handleClickAndOpenUrlInLocal(
                  e,
                  'https://steamcommunity.com/app/1634680/workshop/'
                )
              }
              style={{ textTransform: 'none' }}
            >
              创意工坊(魔法也是不错的选择)
            </Button>
          </Typography>
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
