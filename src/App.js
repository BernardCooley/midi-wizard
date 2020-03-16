import React, {useState} from 'react';
import './App.css';
import DeviceList from './components/DeviceList/DeviceList';
import AddDevice from './components/AddDevice/AddDevice';
import AddUser from './components/Auth/AddUser/AddUser';
import Login from './components/Auth/Login/Login';
import firebase from './firebase';

function App() {

  const db = firebase.firestore();
  const userDeviceDataRef = db.collection('UserDeviceData');
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [isUserLoggedIn, setisUserLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setLoggedInUserId(user.uid);
      setisUserLoggedIn(true);
      getUsername(user.uid);
    } else {
      setLoggedInUserId('');
      setisUserLoggedIn(false);
      getUsername('');
    }
  })

  const getUsername = async (userId) => {
    const response = await userDeviceDataRef.doc(userId).get();
    const data = await response.data();
    setUsername(data.username);
  }

  const logout = () => {
    firebase.auth().signOut();
  }

  return (
    <div className="App">
      {isUserLoggedIn ? 
      <div>
        Welcome {username.replace(/ .*/,'')}
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
