import React from 'react';
import './Header.scss';
import firebase from '../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAdminConsole } from '../../actions';

const Header = () => {

    const dispatch = useDispatch();
    const isAdmin = useSelector(state => state.isAdmin);
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const isAdminConsoleOpen = useSelector(state => state.isAdminConsoleOpen);

    const logout = () => {
        firebase.auth().signOut();
    }

    const openAdminConsole = () => {
        dispatch(toggleAdminConsole(true));
    }

    return (
        <div className='headerContainer'>

            {isAdmin && !isAdminConsoleOpen ? <button onClick={openAdminConsole}>Admin console</button> : null}

            {isLoggedIn ? 
                <button onClick={logout}>Logout</button> : null
            }
            Header
        </div>
    )
}

export default Header;