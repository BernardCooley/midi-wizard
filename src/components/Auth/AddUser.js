import React from 'react';
import firebase from '../../firebase';

const addUser = () => {
    const db = firebase.firestore();
    const userDeviceDataRef = db.collection('UserDeviceData');


    // TODO implement firestore authentication before adding user details to database
    const addUser = (e) => {
        e.preventDefault();

        userDeviceDataRef

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

export default Auth;