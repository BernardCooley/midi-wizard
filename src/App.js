import React, {useEffect, useState} from 'react';
import './App.css';
import DeviceList from './components/DeviceList/DeviceList';
import AddDevice from './components/AddDevice/AddDevice';
import AddUser from './components/Auth/AddUser/AddUser';
import Login from './components/Auth/Login/Login';
import firebase from './firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setIsLoggedIn, setCurrentUserId, setCurrentUsername, setStockDevices, setUserDevices } from './actions';

function App() {
  const dispatch = useDispatch();
  const currentUserId = useSelector(state => state.currentUserId);
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const username = useSelector(state => state.currentUsername);

  const db = firebase.firestore();
  const userDeviceDataRef = db.collection('UserDeviceData');
  const allDeviceDataRef = db.collection('DeviceData');

  useEffect(() => {
    getStockDevices();
  }, []);

  firebase.auth().onAuthStateChanged(user => {
      if (user) {
          dispatch(setIsLoggedIn(true));
          dispatch(setCurrentUserId(user.uid));
          getUsername(user.uid);
          getUserDevices(user.uid);
      } else {
          dispatch(setIsLoggedIn(false));
          dispatch(setCurrentUserId(''));
      }
  })

  const getStockDevices = async () => {
    await allDeviceDataRef.onSnapshot(response => {
        const data = response.docs.map(doc => doc.data());
        dispatch(setStockDevices(data));
    });
  }

  const getUserDevices = async (userId) => {
    await userDeviceDataRef.doc(userId).onSnapshot(response => {
      dispatch(setUserDevices(response.data().devices));
    })
  }

  const getUsername = async (userId) => {
    await userDeviceDataRef.doc(userId).onSnapshot(response => {
      dispatch(setCurrentUsername(response.data().username));  
    })
  }

  const logout = () => {
    firebase.auth().signOut();
  }

  return (
    <div className="App">
    User id: {currentUserId}
    Is logged in: {isLoggedIn.toString()}

      {isLoggedIn ? 
      <div>
        Welcome {username.replace(/ .*/,'')}
        <button onClick={logout}>Logout</button>
        <AddDevice currentUserId = {currentUserId}/>
        <DeviceList currentUserId = {currentUserId}/>
      </div> : 
      <div>
        <Login/>
        <AddUser/>
      </div>}
    </div>
  );
}

export default App;
