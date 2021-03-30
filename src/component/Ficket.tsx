import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MainContainer from './MainContainer';
import DrawerContainer from './DrawerContainer';
import AppBarContainer from './AppBarContainer';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      height: 'inherit',
      width: 'inherit',
    },
  })
);

export default function Ficket() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBarContainer />
      <DrawerContainer />
      <MainContainer />
    </div>
  );
}
