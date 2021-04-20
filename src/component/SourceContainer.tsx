import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import SourceList from './SourceList';
import SourceEdit from './SourceEdit';
import SourceImport from './SourceImport';

export default function SourceContainer() {
  const [currentSource, setCurrentSource] = useState({});

  const handleCurrentSourceChange = (source: any) => {
    console.log('------------current source is', source);
    setCurrentSource(source);
  };
  return (
    <div className="source">
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
