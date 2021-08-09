import {
  Divider,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import Toolbar from '@material-ui/core/Toolbar';
import MovieIcon from '@material-ui/icons/Movie';
import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import GolfCourseIcon from '@material-ui/icons/GolfCourse';
import HelpIcon from '@material-ui/icons/Help';
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
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleChangeEpisode = (href: string, index: number) => {
    if (currentInfo.videoUrl === href) {
      return;
    }
    const changedInfo = _.clone(currentInfo);
    changedInfo.videoUrl = href;
    changedInfo.activeEpisode = index;
    changeCurrentInfo(changedInfo);
  };

  const checkActive = (index: number) => {
    if (currentInfo.activeEpisode) {
      return currentInfo.activeEpisode === index;
    }
    if (playlists.activeEpisode) return playlists.activeEpisode === index;
    return false;
  };
  const renderPlaylist = () => {
    if (_.isEmpty(playlists)) {
      return '';
    }
    return playlists[playlists.activeIndex || 0].map(
      (i: any, index: number) => {
        return (
          <ListItem
            selected={checkActive(index)}
            button
            key={i.title}
            onClick={() => handleChangeEpisode(i.href, index)}
          >
            <ListItemIcon />
            <ListItemText primary={i.title} />
          </ListItem>
        );
      }
    );
  };
  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
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
        <ListItem
          button
          key="online-video"
          component={Link}
          to="/"
          selected={selectedIndex === 0}
          onClick={() => handleListItemClick(0)}
        >
          <ListItemIcon>
            <MovieIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="在线视频" />
        </ListItem>
        <ListItem
          button
          key="day-article"
          component={Link}
          to="/book"
          selected={selectedIndex === 1}
          onClick={() => handleListItemClick(1)}
        >
          <ListItemIcon>
            <LocalLibraryIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="开卷有益" />
          <ListItemText secondary="预览版" />
        </ListItem>
        <ListItem
          button
          key="video-parsing"
          component={Link}
          to="/parsing"
          selected={selectedIndex === 2}
          onClick={() => handleListItemClick(2)}
        >
          <ListItemIcon>
            <GolfCourseIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="解析" />
          <ListItemText secondary="预览版" />
        </ListItem>
        <ListItem
          button
          key="about-me"
          component={Link}
          to="/main/about"
          selected={selectedIndex === 3}
          onClick={() => handleListItemClick(3)}
        >
          <ListItemIcon>
            <HelpIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="有疑问" />
        </ListItem>
        <Divider />
        <Switch>
          <Route path="/main/webview">{renderPlaylist}</Route>
        </Switch>
      </div>
    </Drawer>
  );
}
