import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { updateSourcesFromUrl } from '../../../utils/SpiderUtils';
import BackdropContainer from '../../BackdropContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1, 1),
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '40ch',
      },
    },
    button: {
      margin: theme.spacing(1, 10, 1, 1),
      float: 'right',
    },
    hidden: {
      display: 'none',
    },
  })
);

export default function SourceImport() {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();
  const [displayMessage, setDisplayMessage] = useState(false);
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const onSubmit = async (data: any) => {
    setOpen(true);
    setDisplayMessage(false);
    try {
      await updateSourcesFromUrl(data.sourcesUrl);
      history.push('/main/source/list');
    } catch (e) {
      setDisplayMessage(true);
      console.log(e);
    }
    setOpen(false);
  };

  return (
    <div>
      <form
        className={classes.root}
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          name="sourcesUrl"
          required
          id="outlined-helperText"
          label="源链接"
          helperText="ex:http://xxx.com/xxx.json"
          variant="outlined"
          inputRef={register}
        />
        <div>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            className={classes.button}
          >
            import
          </Button>
        </div>
      </form>
      <div className={displayMessage ? '' : classes.hidden}>
        <h4>看起来有些问题，你最好重新来一次</h4>
      </div>
      <BackdropContainer
        open={open}
        onClick={() => {
          setOpen(false);
        }}
        message="importing...."
      />
    </div>
  );
}
