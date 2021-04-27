import React from 'react';
import './App.global.css';
import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from '@material-ui/core';
import { HashRouter, Route } from 'react-router-dom';
import { amber, cyan } from '@material-ui/core/colors';
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
  return (
    <div className="main-body">
      <CssBaseline />
      <HashRouter>
        <MuiThemeProvider theme={theme}>
          <Route path="/" component={Ficket} />
        </MuiThemeProvider>
      </HashRouter>
    </div>
  );
}
