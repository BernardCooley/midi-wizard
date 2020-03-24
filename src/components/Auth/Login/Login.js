import React from 'react';
import firebase from '../../../firebase';

const Login = () => {

    const login = async e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        firebase.auth().signInWithEmailAndPassword(email, password);
    }

    const styles = {

    }

    return (
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