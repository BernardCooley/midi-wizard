import React from 'react';
import './App.css';
import DeviceList from './components/DeviceList/DeviceList';
import AddDevice from './components/AddDevice/AddDevice';

function App() {
  return (
    <div className="App">
      <AddDevice/>
      <DeviceList/>
    </div>
  );
}

export default App;
