import React from 'react';
import './Header.scss';
import firebase from '../../firebase';
import { useSelector } from 'react-redux';

const Header = () => {

    const isLoggedIn = useSelector(state => state.isLoggedIn);

    const logout = () => {
        firebase.auth().signOut();
    }

    return (
        <div className='headerContainer'>
            {isLoggedIn ? 
                <button onClick={logout}>Logout</button> : null
            }
            Header
        </div>
    )
}

export default Header;