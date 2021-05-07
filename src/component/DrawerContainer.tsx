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
import { Link, Route, Switch } from 'react-router-dom';
import _ from 'lodash';

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

export default function DrawerContainer(props: any) {
  const classes = useStyles();
  const { currentInfo, changeCurrentInfo, playlists } = props;

  const handleChangeEpisode = (href: string) => {
    if (currentInfo.videoUrl === href) {
      return;
    }
    const changedInfo = _.clone(currentInfo);
    changedInfo.videoUrl = href;
    changeCurrentInfo(changedInfo);
  };

  const renderPlaylist = () => {
    if (_.isEmpty(playlists)) {
      return '';
    }
    return playlists[playlists.activeIndex || 0].map(
      (i: any, index: number) => {
        return (
          <ListItem
            selected={
              playlists.activeEpisode && playlists.activeEpisode === index
            }
            button
            key={i.title}
            onClick={() => handleChangeEpisode(i.href)}
          >
            <ListItemIcon />
            <ListItemText primary={i.title} />
          </ListItem>
        );
      }
    );
  };
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
        <ListItem button key="online-video" component={Link} to="/">
          <ListItemIcon>
            <MovieIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="在线视频" />
        </ListItem>
        <Divider />
        <Switch>
          <Route path="/main/webview">{renderPlaylist}</Route>
        </Switch>
      </div>
    </Drawer>
  );
}
