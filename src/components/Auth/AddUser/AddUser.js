import React from 'react';
import firebase from '../../../firebase';
import styled from 'styled-components';
import { useSelector } from 'react-redux';


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
    const userLayoutDataRef = db.collection('UserLayouts');
    const userId = useSelector(state => state.currentUserId);

    const addUser = async e => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const email = e.target.email.value;
        const rollBackData = [];

        // Sign up with email and password
        await signUp(email, password).then(signUpResp => {
            rollBackData.push(signUpResp);
            // create new layout document
            createNewLayoutDoc().then(createNewLayoutDocResp => {
                rollBackData.push(createNewLayoutDocResp);
                const newLayoutDocId = createNewLayoutDocResp.id;
                // add default data to newly created layout
                populateNewLayout(newLayoutDocId).then(() => {
                    // add signed up user to database
                    createUserInDatabase(signUpResp.user.uid, username, newLayoutDocId).then(createUserInDatabaseResp => {
                        console.log(email, password);
                        rollBackData.push(createUserInDatabaseResp);
                    }).catch(error => {
                        console.error(error);
                        rollBack(rollBackData);
                    });
                }).catch(error => {
                    console.error(error);
                    rollBack(rollBackData);
                });
            }).catch(error => {
                console.error(error);
                rollBack(rollBackData);
            });
        }).catch(error => {
            console.error(error);
            rollBack(rollBackData);
        });
    }

    const rollBack = rollBackData => {
        rollBackData.forEach((data, index) => {
            switch(index) {
                case 0:
                    data.user.delete();
                    break;
                case 1:
                    userLayoutDataRef.doc(rollBackData[index].id).delete();
                    break;
                case 2:
                    userDeviceDataRef.doc(userId).delete();
            };
        });
    }

    const signUp = async (email, password) => {
        return await firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    const createUserInDatabase = async (userId, username, layoutId) => {
        const newUser = {
            devices: [],
            username: username,
            admin: false,
            layouts: [layoutId],
            admin: false
        }
        return await userDeviceDataRef.doc(userId).set(newUser);
    }

    const populateNewLayout = async layoutId => {
        const newLayout = {
            devices: [],
            layoutId: layoutId,
            layoutName: 'Default'
        }
        return await userLayoutDataRef.doc(layoutId).set(newLayout);
    }

    const createNewLayoutDoc = async () => {
        return await userLayoutDataRef.doc();
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