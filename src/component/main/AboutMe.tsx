import React from 'react';
import { Button, Divider, Link, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
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
      <Typography variant="h3" align="center">
        Q/A
      </Typography>
      <Typography variant="h4">这软件咋用</Typography>
      <Typography>
        如果这是你第一次打开软件，就直接在搜索框搜自己想看的剧就好
      </Typography>
      <br />
      <Typography variant="h4">搜到的资源都不能看啊</Typography>
      <Typography>建议搜搜热门剧集，如果都不能用，多半是你挂代理了</Typography>
      <Typography>
        资源网站并不财大气粗，买不了那么多服务器，你在北京，他在深圳，每个人得到的体验自然不一样
      </Typography>
      <br />
      <Typography variant="h4">你这软件有啥用？</Typography>
      <Typography variant="body1">
        如果你经常追剧的话，应该会遇到下列问题：
      </Typography>
      <Typography>1. 一直用的追剧网站倒了，不能看了，速度慢了</Typography>
      <Typography>2. 想看的剧更新了，网站却没更新 </Typography>
      <Typography>3. 本来看着好好的，就第30集不能看了</Typography>
      <Typography>4. 追番几个网站，国产剧好几个，美剧就别说了</Typography>
      <Typography>5. 买vip我心甘情愿，超前点播是啥？？？</Typography>
      <br />
      <Typography variant="h4">以后打算更新啥</Typography>
      <Typography>大一点的更新，小说，漫画的支持</Typography>
      <Typography>小一点的更新，引入R18+模式</Typography>
      <Typography>
        其实建立社区最重要，你不催，他不催，天天空洞骑士了
      </Typography>
      <br />
      <Divider />
      <Typography variant="h3" align="center">
        你可以加群进行反馈
      </Typography>
      <Typography variant="h4" align="center">
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
          <Typography variant="h4">661582868</Typography>
        </Button>
      </Typography>
      <Divider className={classes.divider} />

      <div>
        <Typography variant="h4" align="center">
          本软件只建议用于播放国内无版权剧集
        </Typography>
        <Typography variant="h4" align="center">
          所有数据收集于互联网，请勿做分享使用
        </Typography>
      </div>
    </div>
  );
}
