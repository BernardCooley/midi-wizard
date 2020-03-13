import React from 'react';
import './App.css';
import DeviceList from './components/DeviceList/DeviceList';
import AddDevice from './components/AddDevice/AddDevice';
import AddUser from './components/Auth/AddUser';

function App() {
  return (
    <div className="App">
      <AddUser/>
      <AddDevice/>
      <DeviceList/>
    </div>
  );
}

export default App;
