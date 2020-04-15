import React, { useState } from 'react';
import firebase from '../../../firebase';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { currentAuthComponent } from '../../../actions';


const Styles = styled.div`
    .registerOptionsContainer {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin: auto;
        flex-wrap: wrap;

        .optionContainer {
            margin-top: 50px;
            color: white;

            .optionLink {
                text-decoration: underline;
                cursor: pointer;
                font-weight: bold;

                &:hover {
                    color: lightgray;
                }
            }
        }
    }

    .registerForm {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .fieldContainer {
            width: 100%;
            margin-bottom: 30px;
            height: 70px;

            .validationContainer {
                color: red;
                min-height: 20px;
            } 

            .inputField {
                width: 100%;
                font-size: 30px;
                height: 50px;
                text-align: center;
                border-radius: 5px;
                background-color: darkgray;
                border: 1px solid lightgray;
                outline: none;
            }
        }

        .submitButton {
            width: 150px;
            height: 50px;
            font-size: 20px;
            cursor: pointer;
            background-color: white;
            color: #383838;
            border: 1px solid darkgray;
            border-radius: 10px;

            &:hover {
                background-color: #383838;
                color: white;
                border: none;
            }
        }
    }
`

const AddUser = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm();
    const db = firebase.firestore();
    const userDeviceDataRef = db.collection('UserDeviceData');
    const userLayoutDataRef = db.collection('UserLayouts');
    const userId = useSelector(state => state.currentUserId);

    const registerUser = async data => {
        const rollBackData = [];

        // Sign up with email and password
        await signUp(data.email, data.password).then(signUpResp => {
            rollBackData.push(signUpResp);
            // create new layout document
            createNewLayoutDoc().then(createNewLayoutDocResp => {
                rollBackData.push(createNewLayoutDocResp);
                const newLayoutDocId = createNewLayoutDocResp.id;
                // add default data to newly created layout
                populateNewLayout(newLayoutDocId).then(() => {
                    // add signed up user to database
                    createUserInDatabase(signUpResp.user.uid, data.username, newLayoutDocId).then(createUserInDatabaseResp => {
                        console.log(data.email, data.password);
                        rollBackData.push(createUserInDatabaseResp);
                        signUpResp.user.sendEmailVerification().then(function () {
                            alert('Verification email sent. Please check your inbox.');
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000);
                        }).catch(error => {
                            console.error(error);
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
        }).catch(error => {
            console.error(error);
            rollBack(rollBackData);
        });
    }

    const rollBack = rollBackData => {
        rollBackData.forEach((data, index) => {
            switch (index) {
                case 0:
                    data.user.delete();
                    break;
                case 1:
                    userLayoutDataRef.doc(rollBackData[index].id).delete();
                    break;
                case 2:
                    userDeviceDataRef.doc(userId).delete();
            }
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
            layouts: [layoutId]
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

    const showLoginForm = () => {
        dispatch(currentAuthComponent('login'));
    }

    return (
        <Styles>
            <form onSubmit={handleSubmit(registerUser)} className="registerForm" noValidate>

                <div className='fieldContainer'>
                    <input className='inputField' type="email" placeholder="Email" name="email" ref={register({
                        required: 'Email address is required',
                        pattern: {
                            value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: 'Email address invalid'
                        }
                    })}></input>
                    <div className='validationContainer'>{errors.email && errors.email.message}</div>
                </div>

                <div className='fieldContainer'>
                    <input className='inputField' type="text" placeholder="Username" name="username" ref={register({
                        required: 'Username is required'
                    })}></input>
                    <div className='validationContainer'>{errors.username && errors.username.message}</div>
                </div>

                <div className='fieldContainer'>
                    <input className='inputField' type="password" placeholder="Password" name="password" ref={register({
                        required: 'Password is required'
                    })}></input>
                    <div className='validationContainer'>{errors.password && errors.password.message}</div>
                </div>

                <button className='submitButton' type="submit">Register</button>
            </form>

            <div className='registerOptionsContainer'>
                <div className='optionContainer'>Already registered? <span className='optionLink' onClick={showLoginForm}>Log in</span></div>
            </div>
        </Styles>
    )

}

export default AddUser;