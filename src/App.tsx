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
  const [workshopContext, setWorkshopContext] = useState({
    workshopSource: new Array(0),
    loadSuccess: false,
    setState: '',
  });
  useEffect(() => {
    if (greenworks.init()) {
      getWorkShopItemsPathAndSetToState((source: any) =>
        setWorkshopContext(source)
      );
    }
  }, [workshopContext.loadSuccess]);
  return (
    <div className="main-body">
      <CssBaseline />
      <HashRouter>
        <MuiThemeProvider theme={theme}>
          <WorkshopContext.Provider value={workshopContext}>
            <Route path="/" component={Ficket} />
          </WorkshopContext.Provider>
        </MuiThemeProvider>
      </HashRouter>
    </div>
  );
}
