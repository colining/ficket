import React, { useContext, useEffect, useState } from 'react';
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
import { WorkshopContext } from '../utils/SteamWorks';
import WorkshopDialog from './WorkshopDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      '& .MuiTextField-root': {
        margin: theme.spacing(2),
        width: '60ch',
      },
      '& .MuiTypography-root': {
        margin: theme.spacing(2, 0),
      },
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
    dialogForm: {
      '& .MuiTextField-root': {
        margin: theme.spacing(2),
        width: '40ch',
      },
      '& .MuiTypography-root': {
        margin: theme.spacing(2, 0),
      },
    },
  })
);

export default function SourceList(props: any) {
  const [sources, setSources] = useState(read());
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setCurrentSource } = props;
  const [sourceForPublish, setSourceForPublish] = useState({});
  const workshopContext = useContext(WorkshopContext);

  const history = useHistory();

  useEffect(() => {
    console.log(workshopContext.workshopSource);
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
  function openDialog(index: number) {
    setDialogOpen(true);
    setSourceForPublish(sources[index]);
  }

  const renderRow = () => {
    const workshopSources = workshopContext.workshopSource.map(
      (source: any) => (
        <Card key={source.name + source.workshopTag}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {source.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {source.homepageUrl} 来自创意工坊
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              disabled={source.workshopTag}
              size="small"
              color="primary"
              variant="outlined"
            >
              编辑
            </Button>
            <Button
              disabled={source.workshopTag}
              size="small"
              color="primary"
              variant="outlined"
            >
              删除
            </Button>
          </CardActions>
        </Card>
      )
    );
    const customSources = sources.map((source: any, index: number) => (
      <Card key={source.name + source.workshopTag}>
        <CardActionArea onClick={() => handleEdit(index)}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {source.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {source.homepageUrl} {source.workshopTag ? '来自创意工坊' : ''}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            disabled={source.workshopTag}
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => handleEdit(index)}
          >
            编辑
          </Button>
          <Button
            disabled={source.workshopTag}
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => handleDelete(index)}
          >
            删除
          </Button>
          <Button
            disabled={source.workshopTag}
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => openDialog(index)}
          >
            上传至创意工坊
          </Button>
        </CardActions>
      </Card>
    ));
    return (
      <div>
        {workshopSources}
        {customSources}
      </div>
    );
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
      <SourceReminder
        sources={workshopContext.workshopSource.concat(sources)}
      />
      <WorkshopDialog
        source={sourceForPublish}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </div>
  );
}
