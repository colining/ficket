import { Button, Dialog, Typography } from '@material-ui/core';
import React from 'react';
import WebView from 'react-electron-web-view';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  tips: {
    marginTop: '10px',
    width: '100%',
    height: '100%',
  },
  webview: {
    margin: '10px 10px 0px 10px',
  },
});

export default function LoginDialog(props: any) {
  const { url, dialogOpen, setDialogOpen } = props;

  const classes = useStyles();
  const handleSaveCookie = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={dialogOpen}
        aria-labelledby="form-dialog-title"
      >
        <div className={classes.tips}>
          <div style={{ float: 'left', width: '60%' }}>
            <Typography variant="h5" align="right">
              请在本页面进行账号密码登录授权
            </Typography>
          </div>
          <div style={{ float: 'left', marginLeft: '20px' }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => handleSaveCookie()}
            >
              完成授权
            </Button>
          </div>
        </div>
        <div className={classes.webview}>
          <WebView
            style={{
              height: '800px',
            }}
            src={url}
          />
        </div>
      </Dialog>
    </div>
  );
}
