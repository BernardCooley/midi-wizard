import React, {useEffect} from 'react';
import './App.scss';
import DeviceList from './components/DeviceList/DeviceList';
import AddDevice from './components/AddDevice/AddDevice';
import AddUser from './components/Auth/AddUser/AddUser';
import Login from './components/Auth/Login/Login';
import firebase from './firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setIsLoggedIn, setCurrentUserId, setCurrentUsername, setStockDevices, setUserDevices } from './actions';
import ToggleDeviceTray from './components/ToggleDeviceTray/ToggleDeviceTray';
import Header from './components/Header/Header';

function App() {
  
  const dispatch = useDispatch();
  const currentUserId = useSelector(state => state.currentUserId);
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const username = useSelector(state => state.currentUsername);
  const deviceTrayOpen = useSelector(state => state.isDeviceTrayOpen);

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

  const getUserDevices = async userId => {
    await userDeviceDataRef.doc(userId).onSnapshot(response => {

      if(response.data().devices) {
        dispatch(setUserDevices(response.data().devices))
      }
    })
  }

  const getUsername = async userId => {
    await userDeviceDataRef.doc(userId).onSnapshot(response => {
      dispatch(setCurrentUsername(response.data().username));  
    })
  }

  const logout = () => {
    firebase.auth().signOut();
  }

  return (
    <div className="App">
      <Header/>
      {isLoggedIn ? 
      <div className='loggedInContainer'>
        <button onClick={logout}>Logout</button>
        <AddDevice currentUserId = {currentUserId}/>
        <div className={`deviceTrayContainer ${ deviceTrayOpen ? '': 'deviceContainerClosed'}`}>
          <ToggleDeviceTray/>
          <DeviceList className='deviceListOuterContainer' currentUserId = {currentUserId}/>
        </div>
      </div> : 
      <div>
        <Login/>
        <AddUser/>
      </div>}
    </div>
  );
}

export default App;
