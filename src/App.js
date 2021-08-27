import React, { useEffect, useState } from 'react';
import StudioDesignerPage from './pages/StudioDesigner/StudioDesignerPage';
import HeaderOld from './components/Header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { setIsLoggedIn, setCurrentUserId, setCurrentUsername, isAdmin, isVerified, isManageAccountPageOpen, allStockDevices, layouts, userData } from './actions';
import firebase from './firebase';
import LandingPage from './pages/Landing/LandingPage';
import AdminConsole from './pages/AdminConsole/AdminConsole';
import styled from 'styled-components';
import ManageAccountPage from './pages/ManageAccount/ManageAccountPage';
import { Header } from './stories';


const Styles = styled.div`
  .App {
    height: 99%;

    .loggedInContainer {
      height: 100vh;
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
  const usersRef = db.collection('Users');
  const allStockDevicesRef = db.collection('StockDevices');
  const isAdminConsoleOpen = useSelector(state => state.isAdminConsoleOpen);
  const userId = useSelector(state => state.currentUserId);
  const isUserVerified = useSelector(state => state.isVerified);
  const manageAccountPageOpen = useSelector(state => state.isManageAccountPageOpen);
  const [currentPage, setCurrentPage] = useState('');
  const isUserAdmin = useSelector(state => state.isAdmin);

  useEffect(() => {
    getAllStockDevices();
  }, []);

  useEffect(() => {
    getCurrentPage();
  }, [isAdminConsoleOpen, manageAccountPageOpen]);

  useEffect(() => {
    if (userId.length > 0) {
      getLayouts(userId);
    }
  }, [userId]);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      if (user.emailVerified) {
        dispatch(isVerified(true));
      }
      dispatch(setIsLoggedIn(true));
      dispatch(setCurrentUserId(user.uid));
      getUsername(user.uid).then(() => {
        getIsAdmin(user.uid).then(() => {
          getUserData(user.uid);
        });
      });
    } else {
      dispatch(setIsLoggedIn(false));
      dispatch(setCurrentUserId(''));
    }
  });

  const getCurrentPage = () => {
    if (manageAccountPageOpen) {
      dispatch(isManageAccountPageOpen(true));
      setCurrentPage('account');
    } else if (isAdminConsoleOpen) {
      dispatch(isManageAccountPageOpen(false));
      setCurrentPage('adminConsole');
    } else {
      setCurrentPage('workspace');
      dispatch(isManageAccountPageOpen(false));
    }
  }

  const getUsername = async userId => {
    return userDataRef.doc(userId).onSnapshot(response => {
      if (response.data()) {
        dispatch(setCurrentUsername(response.data().username));
      }
    });
  }

  const getUserData = async userId => {
    usersRef.doc(userId).onSnapshot(response => {
      if (response.data()) {
        const data = response.data();
        dispatch(userData(data));
      }
    })
  }

  const getAllStockDevices = async () => {
    allStockDevicesRef.onSnapshot(response => {
      const data = response.docs.map(doc => doc.data());
      dispatch(allStockDevices(data));
    });
  }

  const getLayouts = async userId => {
    usersRef.doc(userId).onSnapshot(response => {
      if (response.data()) {
        dispatch(layouts(response.data().layouts));
      }
    });
  }

  const getIsAdmin = async userId => {
    const response = await userDataRef.doc(userId).get();
    if (response.data()) {
      dispatch(isAdmin(response.data().admin));
    }
    return response;
  }

  return (
    <Styles>
      <div className="App">
        {isLoggedIn && isUserVerified ?
          <div className='loggedInContainer'>
            {/* <HeaderOld/> */}
            <Header isAdmin={isUserAdmin} height='50px' />

            {(() => {
              switch (currentPage) {
                case 'adminConsole':
                  return <AdminConsole />;
                case 'account':
                  return <ManageAccountPage />;
                default:
                  return <StudioDesignerPage />;
              }
            })()}

          </div> :
          <div className='loggedOutContainer'>
            <LandingPage />
          </div>
        }
      </div>
    </Styles>
  );
}

export default App;
