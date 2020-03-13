import React from 'react';
import firebase from '../../firebase';
import './Auth.scss';

const AddUser = () => {
    const db = firebase.firestore();
    const userDeviceDataRef = db.collection('UserDeviceData');


    // TODO implement firestore authentication before adding user details to database
    const addUser = async (e) => {
        e.preventDefault();

        // TODO error when adding user
        const signUp = await firebase.auth().createUserWithEmailAndPassword(e.target.email.value, e.target.email.password);
        console.log(signUp);

    }

    return(
        <div className="addUserContainer">
            <form className="addUserForm" onSubmit={addUser}>
            <input type="text" placeholder="name" name="name"></input>
            <input type="email" placeholder="email" name="email"></input>
            <input type="password" placeholder="password" name="password"></input>
            <button type="submit">Create account</button>
            </form>
        </div>
    )

}

export default AddUser;