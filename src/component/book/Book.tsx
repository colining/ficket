import React, { useState } from 'react';
import { Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import getDailyReading from '../../utils/BookUtils';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#e9faff',
    width: '980px',
    overflow: 'hidden',
    margin: '0 auto',
  },
  displayLinebreak: {
    whiteSpace: 'pre-line',
    textIndent: '2em',
    fontFamily: '方正启体简体, "Microsoft YaHei", 微软雅黑, 宋体',
    fontSize: '19pt',
    letterSpacing: '0.2em',
    lineHeight: '150%',
    paddingTop: '15px',
    width: '85%',
    margin: 'auto',
  },
});
export default function Book() {
  const classes = useStyles();
  const [text] = useState(getDailyReading());
  return (
    <div className={classes.root}>
      <Typography variant="h1" gutterBottom align="center">
        {text.title}
      </Typography>
      <Divider />
      <Typography variant="h4" align="center">
        {text.author}
      </Typography>
      <div className={classes.displayLinebreak}>
        {text.article.split('\n').map((i: string) => {
          return <p key={i}>{i}</p>;
        })}
      </div>
    </div>
  );
}
