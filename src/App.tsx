import React from 'react';
import './App.global.css';
import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from '@material-ui/core';
import { HashRouter, Route } from 'react-router-dom';
import { lightBlue, amber } from '@material-ui/core/colors';
import Ficket from './component/Ficket';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: lightBlue[700],
    },
    secondary: {
      main: amber[700],
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
