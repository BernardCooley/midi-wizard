import React from 'react';
import Login from '../../components/Auth/Login/Login';
import AddUser from '../../components/Auth/AddUser/AddUser';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLoginRegister } from '../../actions';

const LandingPage = () => {

    const dispatch = useDispatch();
    const isLoginRegisterOpen = useSelector(state => state.isLoginRegisterOpen);

    const closeLoginRegister = () => {
        dispatch(toggleLoginRegister(false));
    }

    const openLoginRegister = () => {
        dispatch(toggleLoginRegister(true));
    }

    const styles = {
        landingPageContainer: {

        },
        loginRegisterContainer: {
            width: '50%',
            margin: 'auto',
            position: 'relative',
            top: '75px'
        }
    }

    return (
        <div style={styles.landingPageContainer}>
            {!isLoginRegisterOpen ? <button onClick={openLoginRegister} className='toggleLoginRegister'>Login/Register</button> : null}
            
            <h1>Studio Designer</h1>
            
            {isLoginRegisterOpen ?
                <div style={styles.loginRegisterContainer}>
                    <Login/>
                    <AddUser/>
                    <button onClick={closeLoginRegister}>Cancel</button>
                </div> : null
            }
        </div>
    )
}

export default LandingPage;