import React, { useEffect, useState } from 'react';
import StudioDesignerPage from './pages/StudioDesigner/StudioDesignerPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { setIsLoggedIn, setCurrentUserId, setCurrentUsername, setStockDevices, setUserDevicIds, isAdmin, layoutIds, layouts, setUserDevices, isVerified, isManageAccountPageOpen } from './actions';
import firebase from './firebase';
import LandingPage from './pages/Landing/LandingPage';
import AdminConsole from './pages/AdminConsole/AdminConsole';
import styled from 'styled-components';
import ManageAccountPage from './pages/ManageAccount/ManageAccountPage';


const Styles = styled.div`
  .App {
    height: 99%;

    .loggedInContainer {
      height: 100%;
    }

    .loggedOutContainer {

    }
  }
`

function App() {

  const db = firebase.firestore();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const userDataRef = db.collection('UserDeviceData');
  const allDeviceDataRef = db.collection('DeviceData');
  const userLayoutDataRef = db.collection('UserLayouts');
  const isAdminConsoleOpen = useSelector(state => state.isAdminConsoleOpen);
  const userLayoutIds = useSelector(state => state.layoutIds);
  const userId = useSelector(state => state.currentUserId);
  const stockDevices = useSelector(state => state.stockDevices);
  const isUserVerified = useSelector(state => state.isVerified);
  const manageAccountPageOpen = useSelector(state => state.isManageAccountPageOpen);
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    getStockDevices();
  }, []);

  useEffect(() => {
    getCurrentPage();
  }, [isAdminConsoleOpen, manageAccountPageOpen]);

  useEffect(() => {
    if(userId) {
      getLayoutIds(userId);
    }
  }, [userId]);

  useEffect(() => {
    if(userLayoutIds) {
      triggerGetLayouts();
    }
  }, [userLayoutIds]);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      if(user.emailVerified) {
        dispatch(isVerified(true));
      }
      dispatch(setIsLoggedIn(true));
      dispatch(setCurrentUserId(user.uid));
      getUsername(user.uid).then(() => {
        getIsAdmin(user.uid).then(() => {
          getUserDeviceIds(user.uid);
        });
      });
    } else {
      dispatch(setIsLoggedIn(false));
      dispatch(setCurrentUserId(''));
    }
  });

  const getCurrentPage = () => {
    if(manageAccountPageOpen) {
      dispatch(isManageAccountPageOpen(true));
      setCurrentPage('account');
    }else if(isAdminConsoleOpen) {
      dispatch(isManageAccountPageOpen(false));
      setCurrentPage('adminConsole');
    }else {
      setCurrentPage('workspace');
      dispatch(isManageAccountPageOpen(false));
    }
  }

  const getUsername = async userId => {
    return userDataRef.doc(userId).onSnapshot(response => {
      if(response.data()) {
        dispatch(setCurrentUsername(response.data().username));
      }
    });
  }

  const getUserDeviceIds = async userId => {
    userDataRef.doc(userId).onSnapshot(response => {
      if (response.data() && response.data().devices) {
        const userDeviceIds = response.data().devices;

        if(stockDevices.length > 0) {
          const userDevices = stockDevices.filter(device => userDeviceIds.includes(device.deviceId));
          dispatch(setUserDevices(userDevices));
        }
        dispatch(setUserDevicIds(userDeviceIds));
      }
    })
  }

  const getStockDevices = async () => {
    allDeviceDataRef.onSnapshot(response => {
      const data = response.docs.map(doc => doc.data());
      dispatch(setStockDevices(data));
    });
  }

  const getLayoutIds = async uid => {
    userDataRef.doc(uid).onSnapshot(response => {
      if(response.data()) {
        dispatch(layoutIds(response.data().layouts));
      }
    });
  }

  const getLayouts = async () => {
    const layoutsArray = [];

    for (const id of userLayoutIds) {
      const response = await userLayoutDataRef.doc(id).get();
      layoutsArray.push(response.data());
    }
    dispatch(layouts(layoutsArray));
  }

  const triggerGetLayouts = async () => {
    for (const id of userLayoutIds) {
      userLayoutDataRef.doc(id).onSnapshot(response => {
        getLayouts();
      });
    }
  }

  const getIsAdmin = async userId => {
      const response = await userDataRef.doc(userId).get();
      if(response.data()) {
        dispatch(isAdmin(response.data().admin));
      }
      return response;
  }

  return (
    <Styles>
      <div className="App">
        {isLoggedIn && isUserVerified ?
          <div className='loggedInContainer'>
            <Header />

            {(() => {
              switch (currentPage) {
                case 'adminConsole':
                  return <AdminConsole />;
                case 'account':
                  return <ManageAccountPage/>;
                default:
                  return <StudioDesignerPage />;
              }
            })()}

          </div> :
          <div className='loggedOutContainer'>
            <LandingPage />
            <Footer />
          </div>
        }
      </div>
    </Styles>
  );
}

export default App;
