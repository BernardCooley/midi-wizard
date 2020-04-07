import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import firebase from 'firebase';


const Styles = styled.div`
    .deleteAccountButton {
        height: auto;
        margin: 0 10px;
        cursor: pointer;
        width: auto;
        outline: none;
        padding: 8px;
        font-size: 16px;
        background-color: red;
        color: white;
        font-weight: 900;

        &:hover {
            background-color: white;
            color: #383838;
        }
    }
`;

const DeleteAccount = () => {

    const db = firebase.firestore();
    const userLayoutDataRef = db.collection('UserLayouts');
    const userDataRef = db.collection('UserDeviceData');
    const userId = useSelector(state => state.currentUserId);

    const deleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete you account?");

        if(confirmDelete) {
            getUsersLayouts().then(layoutIds => {
                deleteUserFromDB().then(() => {
                    deleteUser().then(() => {
                            alert('Account deleted.');
                        });
                    });
                deleteUsersLayouts(layoutIds);
            });
        }
    }

    const deleteUser = async () => {
        return await firebase.auth().currentUser.delete();
    }

    const getUsersLayouts = async () => {
        const response = await userDataRef.doc(userId).get();
        return response.data().layouts;
    }

    const deleteUsersLayouts = async ids => {
        ids.forEach(async id => {
            await userLayoutDataRef.doc(id).delete();
        })
    }

    const deleteUserFromDB = async () => {
        return await userDataRef.doc(userId).delete();
    }

    return (
        <Styles>
            <button onClick={deleteAccount} className='deleteAccountButton'>Delete account</button>
        </Styles>
    )
}

export default DeleteAccount;