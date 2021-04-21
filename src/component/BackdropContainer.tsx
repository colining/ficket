import { Backdrop, CircularProgress } from '@material-ui/core';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  })
);

export default function BackdropContainer(props: any) {
  const { open, onClick, message } = props;
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={open} onClick={onClick}>
      <CircularProgress color="inherit" />
      <h4>{message}</h4>
    </Backdrop>
  );
}
