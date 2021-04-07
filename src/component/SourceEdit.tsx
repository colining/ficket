import React, { useEffect, useState } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { read, update } from '../utils/JsonUtils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  })
);

export default function SourceEdit() {
  const [sources, setSources] = useState(() => read());

  useEffect(() => {
    console.log('组件重新render');
  });

  const classes = useStyles();

  // all state object is immutable
  const handleDelete = (index: number) => {
    const data = Array.from(sources);
    data.splice(index, 1);
    setSources(data);
    update(data);
  };

  const renderRow = (props: ListChildComponentProps) => {
    const { index } = props;
    return (
      <Card className={classes.root} key={index}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              独播库
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {sources[index].homePageUrl}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Link to="/main/source/edit">
            <Button size="small" color="primary">
              edit
            </Button>
          </Link>
          <Button
            size="small"
            color="primary"
            onClick={() => handleDelete(index)}
          >
            delete
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <div className={classes.root}>
      <FixedSizeList
        height={500}
        width="100%"
        itemSize={150}
        itemCount={sources.length}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
}
