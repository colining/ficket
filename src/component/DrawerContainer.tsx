import {
  Divider,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import MovieIcon from '@material-ui/icons/Movie';
import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
  })
);

export default function DrawerContainer() {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <ListItem button key="online-video">
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary="在线视频" />
        </ListItem>
        <Divider />
      </div>
    </Drawer>
  );
}
