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
import { useHistory } from 'react-router-dom';
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

export default function SourceList(props: any) {
  const [sources, setSources] = useState(() => read());
  const { setCurrentSource } = props;

  const history = useHistory();

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

  const handleEdit = (index: number) => {
    setCurrentSource(sources[index]);
    history.push('/main/source/edit');
  };

  const renderRow = (listChildComponentProps: ListChildComponentProps) => {
    const { index } = listChildComponentProps;
    return (
      <Card className={classes.root} key={index}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              独播库 {sources[index].titleRegex}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {sources[index].homepageUrl}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => handleEdit(index)}
          >
            edit
          </Button>
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
