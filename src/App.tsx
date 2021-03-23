import React from 'react';
import './App.global.css';
import Home from './component/Home';
import SideBar from './component/SideBar';

export default function App() {
  return (
    <div className="main-body">
      <SideBar />
      <Home />
    </div>
  );
}
