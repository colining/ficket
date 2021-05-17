import TextField from '@material-ui/core/TextField';
import {
  Button,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import save from '../utils/JsonUtils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(5, 0),
      '& .MuiTextField-root': {
        margin: theme.spacing(2),
        width: '60ch',
      },
      '& .MuiTypography-root': {
        margin: theme.spacing(2, 0),
      },
    },
    container: {
      margin: theme.spacing(2),
    },
    radioGroup: {
      margin: theme.spacing(2),
    },

    button: {
      margin: theme.spacing(1, 10, 1, 1),
      float: 'right',
    },
  })
);
export default function SourceEdit(props: any) {
  const classes = useStyles();
  const { currentSource } = props;
  const { register, watch, handleSubmit, control } = useForm({
    defaultValues: { method: currentSource.method || 'get' },
  });
  const history = useHistory();
  const watchMethod = watch('method');
  const onSubmit = (data: any) => {
    console.log('data', data);
    save(data);
    history.push('/main/source/list');
  };
  return (
    <div>
      <form
        className={classes.root}
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={classes.container}>
          <Typography>搜索时的请求类型</Typography>
          <Controller
            as={
              <RadioGroup
                className={classes.radioGroup}
                aria-label="gender"
                row
              >
                <FormControlLabel
                  value="get"
                  control={<Radio color="primary" />}
                  label="Get"
                />
                <FormControlLabel
                  value="post"
                  control={<Radio color="primary" />}
                  label="Post"
                />
              </RadioGroup>
            }
            name="method"
            control={control}
          />
        </div>
        <div className={classes.container}>
          <Typography>网站基本信息</Typography>
          <TextField
            name="name"
            required
            id="outlined-helperText"
            label="网站名称"
            defaultValue={currentSource.name}
            helperText="ex:独播库"
            variant="outlined"
            inputRef={register}
          />
          <TextField
            name="homepageUrl"
            required
            multiline
            id="outlined-helperText"
            label="主页链接"
            defaultValue={currentSource.homepageUrl}
            helperText="ex:https://www.duboku.tv/"
            variant="outlined"
            inputRef={register}
          />
        </div>
        <Divider />
        <div className={classes.container}>
          <Typography>搜索请求</Typography>
          <TextField
            name="searchUrlPrefix"
            required
            multiline
            id="outlined-helperText"
            label="搜索前缀"
            defaultValue={currentSource.searchUrlPrefix}
            helperText="ex:https://www.duboku.tv/vodsearch/-------------.html?wd={{searchKey}}"
            variant="outlined"
            inputRef={register}
          />
          {watchMethod === 'post' && (
            <TextField
              name="formData"
              id="outlined-multiline-static"
              label="form data"
              required
              multiline
              rows={4}
              helperText=""
              defaultValue={currentSource.formData}
              variant="outlined"
              inputRef={register}
            />
          )}
        </div>
        <Divider />
        <div className={classes.container}>
          <Typography>搜索结果</Typography>
          <TextField
            name="videoDetailUrlRegex"
            required
            multiline
            id="outlined-helperText"
            label="视频详情页链接正则"
            defaultValue={currentSource.videoDetailUrlRegex}
            helperText="ex:div.detail > h4.title > a"
            variant="outlined"
            inputRef={register}
          />
          <TextField
            name="videoUrlRegex"
            required
            multiline
            id="outlined-helperText"
            label="视频链接正则"
            defaultValue={currentSource.videoUrlRegex}
            helperText="ex:a.btn.btn-sm.btn-warm"
            variant="outlined"
            inputRef={register}
          />
          <TextField
            name="imgUrlRegex"
            required
            multiline
            id="outlined-helperText"
            label="图片链接正则"
            defaultValue={currentSource.imgUrlRegex}
            helperText="ex:div.thumb > a"
            variant="outlined"
            inputRef={register}
          />
          <TextField
            name="titleRegex"
            required
            multiline
            id="outlined-helperText"
            label="标题链接正则"
            defaultValue={currentSource.titleRegex}
            helperText="ex:div.detail > h4 > a"
            variant="outlined"
            inputRef={register}
          />
        </div>
        <Divider />
        <div className={classes.container}>
          <Typography>详情页/选集</Typography>
          <TextField
            name="playlistContainerRegex"
            required
            multiline
            id="outlined-helperText"
            label="视频选集容器正则"
            defaultValue={currentSource.playlistContainerRegex}
            helperText="ex:body"
            variant="outlined"
            inputRef={register}
          />

          <TextField
            name="playlistItemRegex"
            required
            multiline
            id="outlined-helperText"
            label="视频选集正则"
            defaultValue={currentSource.playlistItemRegex}
            helperText="ex:#playlist1 a.btn.btn-default"
            variant="outlined"
            inputRef={register}
          />
        </div>
        <Divider />
        <div className={classes.container}>
          <Typography>分离视频窗口</Typography>
          <TextField
            name="videoRegex"
            required
            multiline
            id="outlined-helperText"
            label="视频窗口正则"
            defaultValue={currentSource.videoRegex}
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
            {_.isEmpty(currentSource) ? '添加' : '更新'}
          </Button>
        </div>
      </form>
    </div>
  );
}
