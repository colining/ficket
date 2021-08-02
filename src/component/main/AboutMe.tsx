import React from 'react';
import {
  Button,
  Card,
  CardMedia,
  Divider,
  Link,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import path from 'path';
import { handleClickAndOpenUrlInLocal } from '../../utils/utils';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: theme.spacing(4, 0, 4, 0),
    },
    contactMe: {
      margin: theme.spacing(2, 2),
    },
    linkButton: {
      textDecoration: 'underline',
      backgroundColor: 'transparent',
    },
    mediaRoot: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    media: {
      height: 200,
      width: 200,
      margin: 'auto',
    },
    divider: {
      margin: theme.spacing(2, 0),
    },
  })
);

export default function AboutMe() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3">您可以通过以下方式联系到我</Typography>
      <div className={classes.contactMe}>
        <Typography>
          个人主页：
          <Button
            component={Link}
            onClick={(e: any) =>
              handleClickAndOpenUrlInLocal(
                e,
                'https://github.com/colining/ficket'
              )
            }
            style={{ textTransform: 'none' }}
          >
            https://github.com/colining/ficket
          </Button>
        </Typography>
        <Typography>
          QQ内测群：
          <Button
            component={Link}
            onClick={(e: any) =>
              handleClickAndOpenUrlInLocal(
                e,
                'https://jq.qq.com/?_wv=1027&k=d8QmDZlH'
              )
            }
            style={{ textTransform: 'none' }}
          >
            661582868
          </Button>
        </Typography>
        <Typography>微信公众号：</Typography>
        <Card className={classes.mediaRoot}>
          <CardMedia
            className={classes.media}
            component="img"
            image={path.join(path.dirname(__dirname), 'assets', 'qrcode.png')}
            title="Contemplative Reptile"
          />
        </Card>
        <Divider className={classes.divider} />
        <Typography variant="h4">本软件只建议用于播放国内无版权剧集</Typography>
        <Typography variant="h4">
          所有数据收集于互联网，请勿做分享使用
        </Typography>
        <Divider className={classes.divider} />
        <Typography>
          2021年了，国内依旧没有任何一个正式渠道可以看权游的最后一集
        </Typography>
        <Typography>就算它烂尾，你起码也得让我看吧</Typography>
        <Typography>某些企业，独家版权，独播，没有最后一集</Typography>
        <Typography>剪辑，上线速度慢，超前点播</Typography>
        <Typography>我无所谓花钱，可能让我花痛快嘛！！！！</Typography>
      </div>
    </div>
  );
}
