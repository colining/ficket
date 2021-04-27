import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  List,
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

  const renderRow = () => {
    return sources.map((source: any, index: number) => (
      <Card key={source.name}>
        <CardActionArea onClick={() => handleEdit(index)}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {source.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {source.homepageUrl}
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
    ));
  };

  return (
    <div className={classes.root}>
      <SourceReminder sources={sources} />
      <div>
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
      </div>
      <div>
        <List component="nav" aria-label="secondary mailbox folders">
          {renderRow()}
        </List>
      </div>
    </div>
  );
}
