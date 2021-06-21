import React, { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import path from 'path';
import fs from 'fs';
import * as greenworks from 'greenworks';
import { read, update } from '../utils/JsonUtils';
import SourceReminder from './SourceReminder';
import { WorkshopContext } from '../utils/SteamWorks';
import BackdropContainer from './BackdropContainer';

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

  const handleClose = () => {
    setDialogOpen(false);
  };

  const { register, handleSubmit, setValue } = useForm();
  const [open, setOpen] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const onSubmit = (data: any) => {
    setOpen(true);
    const date = (+new Date()).toString(36);
    const sourceFileName = path.join(
      path.dirname(__dirname),
      `temp${date}.json`
    );
    fs.writeFileSync(sourceFileName, JSON.stringify(sourceForPublish));
    console.log(data.picturePath);
    console.log(sourceFileName);
    greenworks.ugcPublish(
      sourceFileName,
      data.title,
      data.detail,
      data.picturePath,
      (success: any) => {
        console.log(success);
        setOpen(false);
        setDialogOpen(false);
      },
      (error: any) => {
        console.log(error);
        setOpen(false);
        setOpenSnack(true);
      }
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
      <Dialog
        fullWidth
        maxWidth="md"
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">上传至创意工坊</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <DialogContentText>
              上传至创意工坊，需要提供标题，图片，以及基本描述
            </DialogContentText>
            <div className={classes.dialogForm}>
              <div>
                <Typography>标题及描述</Typography>
                <TextField
                  name="title"
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  label="标题"
                  fullWidth
                  variant="outlined"
                  inputRef={register}
                />
                <TextField
                  required
                  name="detail"
                  autoFocus
                  multiline
                  margin="dense"
                  id="name"
                  label="基本描述"
                  variant="outlined"
                  fullWidth
                  inputRef={register}
                />
              </div>
              <Divider />
              <div>
                <Typography>图片</Typography>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  name="picturePath"
                  id="name"
                  variant="outlined"
                  helperText="图片会上传到用户云，请保持图片名称唯一"
                  fullWidth
                  inputRef={register}
                />

                <Button
                  variant="contained"
                  component="label"
                  style={{ marginTop: '16px' }}
                >
                  上传一张图片
                  <input
                    type="file"
                    hidden
                    onChange={(event) => {
                      setValue(
                        'picturePath',
                        event.target.files && event.target.files[0].path
                      );
                    }}
                  />
                </Button>
              </div>
              <div>
                <Typography>预览</Typography>
                <TextField
                  style={{ width: '100%' }}
                  id="outlined-multiline-flexible"
                  label="源预览"
                  multiline
                  value={JSON.stringify(sourceForPublish, null, 4)}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary">
              上传
            </Button>
          </DialogActions>
        </form>
        <BackdropContainer
          open={open}
          onClick={() => {
            setOpen(false);
          }}
          message="上传中"
        />
        <Snackbar
          open={openSnack}
          onClose={() => setOpenSnack(false)}
          autoHideDuration={2000}
          message="上传失败，请检查图片是否唯一"
        />
      </Dialog>
    </div>
  );
}
