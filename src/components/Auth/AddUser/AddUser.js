import React from 'react';
import firebase from '../../../firebase';
import styled from 'styled-components';


const Styles = styled.div`
    .addUserForm {
        display: flex;
        flex-direction: column;
        width: 300px;
        margin: auto;
        padding: 50px;
    }
`

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
        <Styles>
            <div className="addUserContainer">
                <form className='addUserForm' onSubmit={addUser}>
                    <input type="text" placeholder="Username" name="username"></input>
                    <input type="email" placeholder="Email" name="email"></input>
                    <input type="password" placeholder="Password" name="password"></input>
                    <button type="submit">Create account</button>
                </form>
            </div>
        </Styles>
    )

}

export default AddUser;