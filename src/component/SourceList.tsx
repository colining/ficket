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
import SourceReminder from './SourceReminder';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    button: {
      margin: theme.spacing(1, 10, 1, 1),
      float: 'left',
    },
    media: {
      height: 200,
      width: 200,
      margin: 'auto',
    },
  })
);

export default function SourceList(props: any) {
  const [sources, setSources] = useState(read());
  const { setCurrentSource } = props;

  const history = useHistory();

  useEffect(() => {
    setSources(read());
  }, []);

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

  function handleCreate() {
    setCurrentSource({});
    history.push('/main/source/edit');
  }
  function handleImport() {
    history.push('/main/source/import');
  }

  const renderRow = (listChildComponentProps: ListChildComponentProps) => {
    const { index } = listChildComponentProps;
    return (
      <Card key={index}>
        <CardActionArea onClick={() => handleEdit(index)}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              独播库
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
            variant="outlined"
            onClick={() => handleEdit(index)}
          >
            edit
          </Button>
          <Button
            size="small"
            color="primary"
            variant="outlined"
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
      <SourceReminder sources={sources} />
      <Button
        size="small"
        color="primary"
        variant="contained"
        onClick={() => handleImport()}
        className={classes.button}
      >
        import Sources from url
      </Button>
      <Button
        size="small"
        color="primary"
        variant="contained"
        onClick={() => handleCreate()}
        className={classes.button}
      >
        create new Source
      </Button>
      <FixedSizeList
        height={500}
        width="100%"
        itemSize={100}
        itemCount={sources.length}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
}
