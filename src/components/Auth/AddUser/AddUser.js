import React from 'react';
import firebase from '../../../firebase';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { currentAuthComponent } from '../../../actions';
import { AuthFormContainer, AuthFormField, AuthFormOptions, AuthFormSubmitButton, AuthFormValidationMessage } from '../../../styles/components';


const Styles = styled.div``;

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
            <AuthFormContainer>
                <form onSubmit={handleSubmit(registerUser)} className="formContainer" noValidate>

                    <AuthFormField>
                        <div className='fieldContainer'>
                            <input className={`inputField ${errors.email ? 'errorBorder' : ''}`} type="email" placeholder="Email" name="email" ref={register({
                                required: 'Email address is required',
                                pattern: {
                                    value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: 'Email address invalid'
                                }
                            })}></input>
                            <AuthFormValidationMessage>
                                <div className='validationContainer'>
                                    <span className={errors.email ? 'errorBackground' : ''}>{errors.email && errors.email.message}</span>
                                </div>
                            </AuthFormValidationMessage>
                        </div>

                        <div className='fieldContainer'>
                            <input className={`inputField ${errors.username ? 'errorBorder' : ''}`} type="text" placeholder="Username" name="username" ref={register({
                                required: 'Username is required'
                            })}></input>
                            <AuthFormValidationMessage>
                                <div className='validationContainer'>
                                    <span className={errors.username ? 'errorBackground' : ''}>{errors.username && errors.username.message}</span>
                                </div>
                            </AuthFormValidationMessage>
                        </div>

                        <div className='fieldContainer'>
                            <input className={`inputField ${errors.password ? 'errorBorder' : ''}`} type="password" placeholder="Password" name="password" ref={register({
                                required: 'Password is required'
                            })}></input>
                            <AuthFormValidationMessage>
                                <div className='validationContainer'>
                                    <span className={errors.password ? 'errorBackground' : ''}>{errors.password && errors.password.message}</span>
                                </div>
                            </AuthFormValidationMessage>
                        </div>
                    </AuthFormField>

                    <AuthFormSubmitButton>
                        <button className='submitButton' type="submit">Register</button>
                    </AuthFormSubmitButton>
                </form>
            </AuthFormContainer>

            <AuthFormOptions>
                <div className='optionsContainer'>
                    <div className='optionContainer'>Already registered? <span className='optionLink' onClick={showLoginForm}>Log in</span></div>
                </div>
            </AuthFormOptions>
        </Styles>
    )

}

export default AddUser;