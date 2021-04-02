import React from 'react';
import './App.global.css';
import { CssBaseline } from '@material-ui/core';
import { Route } from 'react-router-dom';
import Ficket from './component/Ficket';

export default function App() {
  return (
    <div className="main-body">
      <CssBaseline />
      <Route path="/" component={Ficket} />
    </div>
  );
}
