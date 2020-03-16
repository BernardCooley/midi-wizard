import React, {useEffect, useState} from 'react';
import firebase from '../../../firebase';
import './Login.scss';

const Login = (props) => {

    const login = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        firebase.auth().signInWithEmailAndPassword(email, password);
    }

    return(
        <div className="loginFormContainer">
            <form className="loginForm" onSubmit={login}>
                <input type="email" placeholder="Email" name="email"></input>
                <input type="password" placeholder="Password" name="password"></input>
                <button type="submit">Log in</button>
            </form>
        </div>
    )
}

export default Login;