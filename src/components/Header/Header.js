import React from 'react';
import firebase from '../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAdminConsole } from '../../actions';

const Header = () => {

    const dispatch = useDispatch();
    const isAdmin = useSelector(state => state.isAdmin);
    const isAdminConsoleOpen = useSelector(state => state.isAdminConsoleOpen);

    const logout = () => {
        firebase.auth().signOut();
    }

    const openAdminConsole = () => {
        dispatch(toggleAdminConsole(true));
    }

    const styles = {
        headerContainer: {
            width: '100%',
            backgroundColor: 'green',
            height: '50px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute'
        },
        button: {
            height: '100%',
            margin: '0 10px',
            cursor: 'pointer',
            width: '100%'
        },
        appTitle: {
            color: 'white'
        },
        buttonContainer: {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '30px',
            width: '115px'
        },
        titleContainer: {

        }
    }

    return (
        <div style={styles.headerContainer}>
            <div style={styles.buttonContainer}>
                {isAdmin && !isAdminConsoleOpen ? <button  style={styles.button} onClick={openAdminConsole}>Admin console</button> : null}
            </div>
            <div style={styles.titleContainer}>
                <h1 style={styles.appTitle}>Studio Designer</h1>
            </div>
            <div  style={styles.buttonContainer}>
                <button style={styles.button} onClick={logout}>Logout</button>
            </div>
        </div>
    )
}

export default Header;