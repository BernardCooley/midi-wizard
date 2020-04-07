import React, { useState } from 'react';
import styled from 'styled-components';
import firebase from 'firebase';


const Styles = styled.div`
    .toggleInputField {
        text-decoration: underline;
        cursor: pointer;
    }

    .changePasswordOuterContainer {


        .passwordErrorMessage {
            color: red;
            height: 30px;
            padding: 10px;
        }

        .changePasswordContainer {
            display: flex;
            align-items: center;
            height: 30px;
            justify-content: center;

            .changePasswordInput {
                width: 200px;
                height: 100%;
                border: none;
                padding-left: 10px;
            }

            .saveButton {
                height: 107%;
                width: 50px;
                border: none;
                border-left: 1px solid lightgray;
                cursor: pointer;
                outline: none;

                &:hover {
                    background-color: darkgray;
                    color: white;
                }
            }
        }
    }
`;

const ChangePassword = () => {
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const savePassword = () => {
        const user = firebase.auth().currentUser;
        const newPassword = document.querySelector(`[name='changePasswordInput']`).value;


        if(newPassword.length < 6) {
            setErrorMessage('Password must be 6 character or longer');
        }else {
            user.updatePassword(newPassword).then(() => {
                alert('Password updated successfully');
                setUpdatingPassword(!updatingPassword);
                setErrorMessage('');
            }).catch(error => {
                console.error(error);
                alert('Something went wrong. Please try again.');
            });
        }
    }

    const toggleInput = () => {
        setUpdatingPassword(!updatingPassword);
    }

    return (
        <Styles>
            {!updatingPassword ?
                <div onClick={toggleInput} className='toggleInputField'>Update Password</div>:
                <div className='changePasswordOuterContainer'>
                    <div className='changePasswordContainer'>
                        <input className='changePasswordInput' name='changePasswordInput' type='text' placeholder='New password'></input>
                        <button className='saveButton' onClick={savePassword}>Save</button>
                    </div>
                    <div className='passwordErrorMessage'>{errorMessage}</div>
                </div>
            }
        </Styles>
    )
}

export default ChangePassword;