import React from 'react';
import './App.global.css';
import { CssBaseline } from '@material-ui/core';
import SearchAppBar from './component/SearchAppBar';

export default function App() {
  return (
    <div className="main-body">
      <CssBaseline />
      <SearchAppBar />
    </div>
  );
}
