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
  const keyPress = (e: any) => {
    if (e.keyCode === 13) {
      console.log('value', e.target.value);
    }
  };

  return (
    <div className={classes.root}>
      <AppBarContainer keyPress={keyPress} />
      <DrawerContainer />
      <MainContainer />
    </div>
  );
}
