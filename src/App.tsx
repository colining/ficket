import React from 'react';
import './App.global.css';
import { CssBaseline } from '@material-ui/core';
import Home from './component/Home';
import SideBar from './component/SideBar';

export default function App() {
  return (
    <div className="main-body">
      <CssBaseline />
      <SideBar />
      <Home />
    </div>
  );
}
