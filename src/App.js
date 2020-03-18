import React, {useEffect} from 'react';
import './App.scss';
import StudioDesignerPage from './pages/StudioDesigner/StudioDesignerPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { setIsLoggedIn, setCurrentUserId, setCurrentUsername, setStockDevices, setUserDevices, isAdmin } from './actions';
import firebase from './firebase';
import LandingPage from './pages/Landing/LandingPage';
import AdminConsole from './pages/AdminConsole/AdminConsole';

function App() {

  const db = firebase.firestore();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const userDataRef = db.collection('UserDeviceData');
  const allDeviceDataRef = db.collection('DeviceData');
  const isAdminConsoleOpen = useSelector(state => state.isAdminConsoleOpen);

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

      if(response.data().devices) {
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

  const getIsAdmin = async userId => {
    const response = await userDataRef.doc(userId).get();
    dispatch(isAdmin(response.data().admin));
  }

  return (
    <div className="App">
      {isLoggedIn ?
        <div className='loggedInContainer'>
          <Header />

          {isAdminConsoleOpen ? <AdminConsole/> : <StudioDesignerPage />}
          
        </div> :
        <div className='loggedOutContainer'>
          <LandingPage/>
          <Footer />
        </div>
      }
    </div>
  );
}

export default App;
