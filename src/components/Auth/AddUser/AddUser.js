import React from 'react';
import firebase from '../../../firebase';
import './AddUser.scss';

const AddUser = () => {
    const db = firebase.firestore();
    const userDeviceDataRef = db.collection('UserDeviceData');

    const addUser = async e => {
        let username = e.target.username.value;
        let password = e.target.password.value;
        let email = e.target.email.value;
        e.preventDefault();

        const signUp = await firebase.auth().createUserWithEmailAndPassword(e.target.email.value, e.target.password.value);
        createUserInDatabase(signUp.user.uid, username);
        signIn(email, password);
    }

    const signIn = async (email, password) => {
        await firebase.auth().signInWithEmailAndPassword(email, password);
    }

    const createUserInDatabase = async (userId, username) => {
        userDeviceDataRef.doc(userId).set({
            devices: [],
            username: username,
            admin: false
        })
    }

    return(
        <div className="addUserContainer">
            <form className="addUserForm" onSubmit={addUser}>
                <input type="text" placeholder="Username" name="username"></input>
                <input type="email" placeholder="Email" name="email"></input>
                <input type="password" placeholder="Password" name="password"></input>
                <button type="submit">Create account</button>
            </form>
        </div>
    )

}

export default AddUser;