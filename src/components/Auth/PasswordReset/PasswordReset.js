import React from 'react';
import firebase from '../../../firebase';
import styled from 'styled-components';
import { currentAuthComponent } from '../../../actions';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';


const Styles = styled.div`

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

    .passwordResetForm {
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
            width: 200px;
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

const PasswordReset = () => {

    const { register, handleSubmit, errors } = useForm();
    const dispatch = useDispatch();

    const sendPasswordResetEmail = data => {
        firebase.auth().sendPasswordResetEmail(data.email).then(function () {
            alert('Password reset email sent');
            window.location.reload();
        }).catch(error => {
            console.error(error);
        });
    }

    const showLoginForm = () => {
        dispatch(currentAuthComponent('login'));
    }

    return (
        <Styles>
            <form onSubmit={handleSubmit(sendPasswordResetEmail)} className="passwordResetForm" noValidate>
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

                <button className='submitButton' type="submit">Reset password</button>
            </form>

            <div className='loginOptionsContainer'>
                <div className='optionContainer'><span className='optionLink' onClick={showLoginForm}>Back to login</span></div>
            </div>
        </Styles>
    )
}

export default PasswordReset;