import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  ButtonGroup,
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
      overflowY: 'auto',
    },
    buttonGroup: {
      position: 'fixed',
      top: theme.spacing(16),
      zIndex: 1001,
    },
    media: {
      height: 200,
      width: 200,
      margin: 'auto',
    },
    sources: {
      marginTop: theme.spacing(8),
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
      <ButtonGroup
        className={classes.buttonGroup}
        variant="contained"
        color="primary"
        aria-label="contained primary button group"
      >
        <Button onClick={() => handleImport()}>通过网址导入</Button>
        <Button onClick={() => handleCreate()}>创建新源</Button>
      </ButtonGroup>
      <div className={classes.sources}>
        <List component="nav" aria-label="secondary mailbox folders">
          {renderRow()}
        </List>
      </div>
      <SourceReminder sources={sources} />
    </div>
  );
}
