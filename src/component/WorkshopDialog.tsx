import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import path from 'path';
import fs from 'fs';
import greenworks from 'greenworks';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import jsonfile from 'jsonfile';
import BackdropContainer from './BackdropContainer';
import Source from '../model/Source';
import { workshopSourceLocalPath } from '../utils/SteamWorksUtils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

export default function WorkshopDialog(props: any) {
  const { source, dialogOpen, setDialogOpen, publishTag } = props;
  const { register, handleSubmit, setValue } = useForm();
  const [open, setOpen] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const handleClose = () => {
    setDialogOpen(false);
    setOpen(false);
  };
  const classes = useStyles();
  const clearSource = (sourceTemp: any) => {
    if (sourceTemp.workshopTag) {
      return new Source(
        sourceTemp.name,
        sourceTemp.method,
        sourceTemp.formData,
        sourceTemp.videoRegex,
        sourceTemp.homepageUrl,
        sourceTemp.searchUrlPrefix,
        sourceTemp.videoDetailUrlRegex,
        sourceTemp.playlistContainerRegex,
        sourceTemp.playlistItemRegex,
        sourceTemp.videoUrlRegex,
        sourceTemp.imgUrlRegex,
        sourceTemp.titleRegex,
        sourceTemp.workshopTag
      );
    }
    return sourceTemp;
  };
  const onSubmit = (data: any) => {
    setOpen(true);
    const date = (+new Date()).toString(36);
    const sourceFileName = path.join(
      path.dirname(__dirname),
      `temp${date}.json`
    );
    fs.writeFileSync(sourceFileName, JSON.stringify(clearSource(source)));
    try {
      if (publishTag) {
        greenworks.ugcPublish(
          sourceFileName,
          data.title,
          data.detail,
          data.picturePath,
          (success: any) => {
            console.log('上传已成功', success);
            setOpen(false);
            setSnackMessage('上传成功，订阅并刷新后即可见');
            setOpenSnack(true);
            setDialogOpen(false);
          },
          (error: any) => {
            console.log(error);
            setOpen(false);
            setSnackMessage('上传失败，请检查图片是否唯一或源不符合json格式');
            setOpenSnack(true);
          }
        );
      } else {
        console.log(source);
        console.log(sourceFileName);
        greenworks.ugcPublishUpdate(
          source.publishedFileId,
          sourceFileName,
          '',
          '',
          '',
          (success: any) => {
            const workshopSourceLocal = jsonfile.readFileSync(
              workshopSourceLocalPath
            );
            const temp = workshopSourceLocal.filter(
              (localSource: any) =>
                localSource.publishedFileId !== source.publishedFileId
            );
            jsonfile.writeFileSync(workshopSourceLocalPath, temp, {
              spaces: 2,
            });
            console.log('上传已成功', success);
            setOpen(false);
            setDialogOpen(false);
            setSnackMessage('更新成功，请重启应用以刷新');
            setOpenSnack(true);
          },
          (error: any) => {
            console.log(error);
            setOpen(false);
            setSnackMessage('请检查源编写是否符合json格式');
            setOpenSnack(true);
          },
          (progress: any) => {
            console.log(progress);
          }
        );
      }
    } catch (error) {
      console.log(error);
      setOpen(false);
      setSnackMessage('看起来发生了错误，请重试');
      setOpenSnack(true);
    }

    fs.unlink(sourceFileName, (e) => {
      console.log(e);
    });
  };

  return (
    <div>
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
              {publishTag
                ? '上传至创意工坊，需要提供标题，图片，以及基本描述'
                : '标题，描述，图片请到您的创意工坊文件直接更新'}
            </DialogContentText>
            <div className={classes.dialogForm}>
              <div>
                <Typography>标题及描述</Typography>
                <TextField
                  required={publishTag}
                  disabled={!publishTag}
                  name="title"
                  autoFocus
                  margin="dense"
                  id="title"
                  label="标题"
                  fullWidth
                  variant="outlined"
                  inputRef={register}
                />
                <TextField
                  required={publishTag}
                  disabled={!publishTag}
                  name="detail"
                  autoFocus
                  multiline
                  margin="dense"
                  id="detail"
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
                  required={publishTag}
                  disabled={!publishTag}
                  autoFocus
                  margin="dense"
                  name="picturePath"
                  id="name"
                  variant="outlined"
                  helperText="图片会上传到用户云，请保持图片名称唯一"
                  fullWidth
                  inputRef={register}
                  style={{ width: '80ch' }}
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
                  value={JSON.stringify(clearSource(source), null, 4)}
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
        <BackdropContainer open={open} message="上传中" />
      </Dialog>
      <Snackbar
        open={openSnack}
        onClose={() => setOpenSnack(false)}
        autoHideDuration={2000}
        message={snackMessage}
      />
    </div>
  );
}
