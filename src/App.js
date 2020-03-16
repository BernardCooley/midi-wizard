import React, {useState} from 'react';
import './App.css';
import DeviceList from './components/DeviceList/DeviceList';
import AddDevice from './components/AddDevice/AddDevice';
import AddUser from './components/Auth/AddUser/AddUser';
import Login from './components/Auth/Login/Login';
import firebase from './firebase';

function App() {

  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [userLoggedIn, setuserLoggedIn] = useState(false);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setLoggedInUserId(user.uid);
      setuserLoggedIn(true);
    } else {
      setLoggedInUserId('');
      setuserLoggedIn(false);
    }
  });

  const logout = () => {
    firebase.auth().signOut();
  }

  return (
    <div className="App">
      User id: {loggedInUserId}
      {userLoggedIn ? 
      <div>
        <button onClick={logout}>Logout</button>
        <AddDevice loggedInUserId = {loggedInUserId}/>
        <DeviceList loggedInUserId = {loggedInUserId}/>
      </div> : 
      <div>
        <Login/>
        <AddUser/>
      </div>}
    </div>
  );
}

export default App;
