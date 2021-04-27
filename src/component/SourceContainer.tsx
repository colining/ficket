import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import SourceList from './SourceList';
import SourceEdit from './SourceEdit';
import SourceImport from './SourceImport';

const useStyles = makeStyles(
  createStyles({
    source: {
      height: '100%',
    },
  })
);

export default function SourceContainer() {
  const [currentSource, setCurrentSource] = useState({});
  const classes = useStyles();

  const handleCurrentSourceChange = (source: any) => {
    console.log('------------current source is', source);
    setCurrentSource(source);
  };
  return (
    <div className={classes.source}>
      <Switch>
        <Route
          path="/main/source/edit"
          render={() => <SourceEdit currentSource={currentSource} />}
        />
        <Route path="/main/source/import" render={() => <SourceImport />} />
        <Route path="/main/source/list">
          <SourceList setCurrentSource={handleCurrentSourceChange} />
        </Route>
      </Switch>
    </div>
  );
}
