import React from 'react';
import './Header.scss';
import firebase from '../../firebase';

const Header = () => {

    const logout = () => {
        firebase.auth().signOut();
    }

    return (
        <div className='headerContainer'>
        <button onClick={logout}>Logout</button>
            Header
        </div>
    )
}

export default Header;