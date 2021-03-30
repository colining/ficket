import React from 'react';
import './App.global.css';
import { CssBaseline } from '@material-ui/core';
import Ficket from './component/Ficket';

export default function App() {
  return (
    <div className="main-body">
      <CssBaseline />
      <Ficket />
    </div>
  );
}
