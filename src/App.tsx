import React, { useEffect, useState } from 'react';
import './App.global.css';
import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from '@material-ui/core';
import { HashRouter, Route } from 'react-router-dom';
import { amber, cyan } from '@material-ui/core/colors';
import * as greenworks from 'greenworks';
import getWorkShopItemsPathAndSetToState, {
  WorkshopContext,
} from './utils/SteamWorks';
import Ficket from './component/Ficket';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: cyan[700],
    },
    secondary: {
      main: amber[600],
    },
  },
});

export default function App() {
  const [workshopSource, setWorkshopSource] = useState({
    workshopSource: [],
    loadSuccess: false,
  });
  useEffect(() => {
    if (greenworks.init()) {
      getWorkShopItemsPathAndSetToState((source: any) =>
        setWorkshopSource(source)
      );
    }
  }, [workshopSource]);
  return (
    <div className="main-body">
      <CssBaseline />
      <HashRouter>
        <MuiThemeProvider theme={theme}>
          <WorkshopContext.Provider value={workshopSource}>
            <Route path="/" component={Ficket} />
          </WorkshopContext.Provider>
        </MuiThemeProvider>
      </HashRouter>
    </div>
  );
}
