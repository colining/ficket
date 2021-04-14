import TextField from '@material-ui/core/TextField';
import { Button, Divider } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
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
export default function SourceEdit(props: any) {
  const classes = useStyles();
  const { currentSource } = props;
  const { register, handleSubmit } = useForm();
  const history = useHistory();

  const onSubmit = (data: any) => {
    console.log('data', data);
    save(data);
    history.push('/main/source/list');
  };
  useEffect(() => {
    console.log('render');
    console.log(currentSource);
  });
  return (
    <div>
      <h4>暂时不支持post请求进行搜索，原因无他，楼主比较懒</h4>
      <form
        className={classes.root}
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <TextField
            name="homepageUrl"
            required
            id="outlined-helperText"
            label="主页链接"
            defaultValue={currentSource.homepageUrl}
            helperText="ex:https://www.duboku.tv/"
            variant="outlined"
            inputRef={register}
          />
          <TextField
            name="searchUrlPrefix"
            required
            id="outlined-helperText"
            label="搜索前缀"
            defaultValue={currentSource.searchUrlPrefix}
            helperText="ex:https://www.duboku.tv/vodsearch/-------------.html?wd={{searchKey}}"
            variant="outlined"
            inputRef={register}
          />
        </div>
        <Divider />
        <div>
          <TextField
            name="videoDetailUrlRegex"
            required
            id="outlined-helperText"
            label="视频详情页链接正则"
            defaultValue={currentSource.videoDetailUrlRegex}
            helperText="ex:div.detail > h4.title > a"
            variant="outlined"
            inputRef={register}
          />
          <TextField
            name="playlistItemRegex"
            required
            id="outlined-helperText"
            label="视频选集正则"
            defaultValue={currentSource.playlistItemRegex}
            helperText="ex:#playlist1 a.btn.btn-default"
            variant="outlined"
            inputRef={register}
          />
          <TextField
            name="videoUrlRegex"
            required
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
            id="outlined-helperText"
            label="标题链接正则"
            defaultValue={currentSource.titleRegex}
            helperText="ex:div.detail > h4 > a"
            variant="outlined"
            inputRef={register}
          />
          <TextField
            name="videoRegex"
            required
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
            {_.isEmpty(currentSource) ? 'add' : 'update'}
          </Button>
        </div>
      </form>
    </div>
  );
}
