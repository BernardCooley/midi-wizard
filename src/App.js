import React from 'react';
import './App.scss';
import StudioDesigner from './pages/StudioDesigner/StudioDesigner';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {

  return (
    <div className="App">
      <Header/>
      <StudioDesigner/>
      <Footer/>
    </div>
  );
}

export default App;
