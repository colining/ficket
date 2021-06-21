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
import BackdropContainer from './BackdropContainer';

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
  const { source, dialogOpen, setDialogOpen } = props;
  const handleClose = () => {
    setDialogOpen(false);
  };
  const classes = useStyles();

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
    fs.writeFileSync(sourceFileName, JSON.stringify(source));
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
                  value={JSON.stringify(source, null, 4)}
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
