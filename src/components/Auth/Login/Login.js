import React from 'react';
import firebase from '../../../firebase';
import styled from 'styled-components';
import { isVerified } from '../../../actions';
import { useDispatch } from 'react-redux';


const Styles = styled.div`
    
`

const Login = () => {
    const dispatch = useDispatch();

    const login = async e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        firebase.auth().signInWithEmailAndPassword(email, password).then(signInResponse => {
            dispatch(isVerified(signInResponse.user.emailVerified));
        })
    }

    return (
        <Styles>
            <div className="loginFormContainer">
                <form className="loginForm" onSubmit={login}>
                    <input type="email" placeholder="Email" name="email"></input>
                    <input type="password" placeholder="Password" name="password"></input>
                    <button type="submit">Log in</button>
                </form>
            </div>
        </Styles>
    )
}

export default Login;