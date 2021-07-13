import TextField from '@material-ui/core/TextField';
import {
  Button,
  Divider,
  Fab,
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
import jsonfile from 'jsonfile';
import save from '../../../utils/JsonUtils';
import { handleClickAndOpenUrlInLocal } from '../../../utils/utils';
import { workshopSourceLocalPath } from '../../../utils/SteamWorksUtils';

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
    fab: {
      position: 'absolute',
      right: '1%',
      top: '120px',
    },
  })
);
const helperText: { [index: string]: any } = {
  name: 'ex:独播库',
  homepageUrl: 'ex:https://www.duboku.tv/',
  searchUrlPrefix:
    'ex:https://www.duboku.tv/vodsearch/-------------.html?wd={{searchKey}}',
  videoDetailUrlRegex: 'ex:div.detail > h4.title > a',
  videoUrlRegex: 'ex:a.btn.btn-sm.btn-warm',
  imgUrlRegex: 'ex:div.thumb > a',
  titleRegex: 'ex:div.detail > h4 > a',
  playlistContainerRegex: 'ex:body',
  playlistItemRegex: 'ex:#playlist1 a.btn.btn-default',
  videoRegex: 'ex:div.myui-player__item.clearfix > div',
};
export default function SourceEdit(props: any) {
  const classes = useStyles();
  const { currentSource } = props;
  const { register, watch, handleSubmit, control } = useForm({
    defaultValues: { method: currentSource.method || 'get' },
  });

  const history = useHistory();
  const watchMethod = watch('method');
  const onSubmit = (data: any) => {
    if (!currentSource.activeTag) {
      save(data);
    } else {
      const changedSource = Object.assign(_.clone(currentSource), data);
      delete changedSource.changedSource;
      currentSource.changedSource = changedSource;
      const oldData = jsonfile
        .readFileSync(workshopSourceLocalPath)
        .filter(
          (item: any) => item.publishedFileId !== changedSource.publishedFileId
        );
      jsonfile.writeFileSync(
        workshopSourceLocalPath,
        oldData.concat(changedSource),
        {
          spaces: 2,
        }
      );
    }
    history.push('/main/source/list');
  };
  const getPropertyFromSource = (property: string) => {
    if (currentSource.changedSource) {
      return currentSource.changedSource[property];
    }
    return currentSource[property];
  };
  const getHelpTextFromSource = (property: string) => {
    if (currentSource.workshopTag) {
      return currentSource[property];
    }
    return helperText[property];
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
            defaultValue={getPropertyFromSource('name')}
            helperText={getHelpTextFromSource('name')}
            variant="outlined"
            inputRef={register}
          />
          <TextField
            name="homepageUrl"
            required
            multiline
            id="outlined-helperText"
            label="主页链接"
            defaultValue={getPropertyFromSource('homepageUrl')}
            helperText={getHelpTextFromSource('homepageUrl')}
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
            defaultValue={getPropertyFromSource('searchUrlPrefix')}
            helperText={getHelpTextFromSource('searchUrlPrefix')}
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
              defaultValue={getPropertyFromSource('formData')}
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
            defaultValue={getPropertyFromSource('videoDetailUrlRegex')}
            helperText={getHelpTextFromSource('videoDetailUrlRegex')}
            variant="outlined"
            inputRef={register}
          />
          <TextField
            name="videoUrlRegex"
            required
            multiline
            id="outlined-helperText"
            label="视频链接正则"
            defaultValue={getPropertyFromSource('videoUrlRegex')}
            helperText={getHelpTextFromSource('videoUrlRegex')}
            variant="outlined"
            inputRef={register}
          />
          <TextField
            name="imgUrlRegex"
            required
            multiline
            id="outlined-helperText"
            label="图片链接正则"
            defaultValue={getPropertyFromSource('imgUrlRegex')}
            helperText={getHelpTextFromSource('imgUrlRegex')}
            variant="outlined"
            inputRef={register}
          />
          <TextField
            name="titleRegex"
            required
            multiline
            id="outlined-helperText"
            label="标题链接正则"
            defaultValue={getPropertyFromSource('titleRegex')}
            helperText={getHelpTextFromSource('titleRegex')}
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
            defaultValue={getPropertyFromSource('playlistContainerRegex')}
            helperText={getHelpTextFromSource('playlistContainerRegex')}
            variant="outlined"
            inputRef={register}
          />

          <TextField
            name="playlistItemRegex"
            required
            multiline
            id="outlined-helperText"
            label="视频选集正则"
            defaultValue={getPropertyFromSource('playlistItemRegex')}
            helperText={getHelpTextFromSource('playlistItemRegex')}
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
            defaultValue={getPropertyFromSource('videoRegex')}
            helperText={getHelpTextFromSource('videoRegex')}
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
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={(e: any) =>
          handleClickAndOpenUrlInLocal(
            e,
            'https://steamcommunity.com/sharedfiles/filedetails/?id=2524760882'
          )
        }
      >
        指南
      </Fab>
    </div>
  );
}
