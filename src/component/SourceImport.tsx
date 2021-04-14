import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { updateSourcesFromUrl } from '../utils/spider';

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
  })
);

export default function SourceImport() {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    await updateSourcesFromUrl(data.sourcesUrl);
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
    </div>
  );
}
