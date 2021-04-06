import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, Divider } from '@material-ui/core';
import save from '../utils/JsonUtils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1, 1),
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    button: {
      margin: theme.spacing(1, 10, 1, 1),
      float: 'right',
    },
  })
);

export default function Source() {
  const classes = useStyles();
  const { register, handleSubmit, watch } = useForm();
  const onSubmit = (data: any) => {
    console.log('data', data);
    save(data);
  };

  console.log(watch('example'));

  return (
    <form
      className={classes.root}
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <TextField
          name="homePageUrl"
          required
          id="outlined-helperText"
          label="主页链接"
          defaultValue=""
          helperText="ex:https://www.duboku.tv/"
          variant="outlined"
          inputRef={register}
        />
        <TextField
          name="searchUrlPrefix"
          required
          id="outlined-helperText"
          label="搜索前缀"
          defaultValue=""
          helperText="ex:https://www.duboku.tv/vodsearch/-------------.html?wd="
          variant="outlined"
          inputRef={register}
        />
      </div>
      <Divider />
      <div>
        <TextField
          name="videoUrlRegex"
          required
          id="outlined-helperText"
          label="视频链接正则"
          defaultValue=""
          helperText="ex:a.btn.btn-sm.btn-warm"
          variant="outlined"
          inputRef={register}
        />
        <TextField
          name="imgUrlRegex"
          required
          id="outlined-helperText"
          label="图片链接正则"
          defaultValue=""
          helperText="ex:div.thumb > a"
          variant="outlined"
          inputRef={register}
        />
        <TextField
          name="titleRegex"
          required
          id="outlined-helperText"
          label="标题链接正则"
          defaultValue=""
          helperText="ex:div.detail > h4 > a"
          variant="outlined"
          inputRef={register}
        />
        <TextField
          name="videoRegex"
          required
          id="outlined-helperText"
          label="视频窗口正则"
          defaultValue=""
          helperText="ex:div.myui-player__item.clearfix > div"
          variant="outlined"
          inputRef={register}
        />
      </div>
      <div>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          className={classes.button}
        >
          确认添加
        </Button>
      </div>
    </form>
  );
}
