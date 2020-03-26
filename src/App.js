import React, { useEffect } from 'react';
import './App.scss';
import StudioDesignerPage from './pages/StudioDesigner/StudioDesignerPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { setIsLoggedIn, setCurrentUserId, setCurrentUsername, setStockDevices, setUserDevices, isAdmin, layoutIds, layouts } from './actions';
import firebase from './firebase';
import LandingPage from './pages/Landing/LandingPage';
import AdminConsole from './pages/AdminConsole/AdminConsole';

function App() {

  const db = firebase.firestore();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const userDataRef = db.collection('UserDeviceData');
  const allDeviceDataRef = db.collection('DeviceData');
  const userLayoutDataRef = db.collection('UserLayouts');
  const isAdminConsoleOpen = useSelector(state => state.isAdminConsoleOpen);
  const userLayoutIds = useSelector(state => state.layoutIds);

  useEffect(() => {
    getStockDevices();
  }, []);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      dispatch(setIsLoggedIn(true));
      dispatch(setCurrentUserId(user.uid));
      getUsername(user.uid);
      getIsAdmin(user.uid);
      getUserDevices(user.uid);
      getLayouts(user.uid);
    } else {
      dispatch(setIsLoggedIn(false));
      dispatch(setCurrentUserId(''));
    }
  });

  const getUsername = async userId => {
    await userDataRef.doc(userId).onSnapshot(response => {
      dispatch(setCurrentUsername(response.data().username));
    })
  }

  const getUserDevices = async userId => {
    await userDataRef.doc(userId).onSnapshot(response => {

      if (response.data().devices) {
        dispatch(setUserDevices(response.data().devices))
      }
    })
  }

  const getStockDevices = async () => {
    await allDeviceDataRef.onSnapshot(response => {
      const data = response.docs.map(doc => doc.data());
      dispatch(setStockDevices(data));
    });
  }

  const getLayoutIds = async userId => {
    const response = await userDataRef.doc(userId).get();
    return response.data().layouts;
  }

  const getLayouts = async userId => {
    const allLayoutIds = await getLayoutIds(userId);
    const uLayouts = [];

    for (const id of allLayoutIds) {
      const response = await userLayoutDataRef.doc(id).get();
      uLayouts.push(response.data());
    }

    dispatch(layouts(uLayouts));
  }

  const getIsAdmin = async userId => {
    const response = await userDataRef.doc(userId).get();
    dispatch(isAdmin(response.data().admin));
  }

  return (
    <div className="App">
      {isLoggedIn ?
        <div className='loggedInContainer'>
          <Header />
          {isAdminConsoleOpen ? <AdminConsole /> : <StudioDesignerPage />}
        </div> :
        <div className='loggedOutContainer'>
          <LandingPage />
          <Footer />
        </div>
      }
    </div>
  );
}

export default App;
