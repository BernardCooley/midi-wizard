import React from 'react';
import firebase from '../../../firebase';
import styled from 'styled-components';
import { isVerified, currentAuthComponent } from '../../../actions';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';


const Styles = styled.div`
    .loginOptionsContainer {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin: auto;
        flex-wrap: wrap;

        .optionContainer {
            margin-top: 50px;

            .optionLink {
                text-decoration: underline;
                cursor: pointer;
                font-weight: bold;

                &:hover {
                    color: green;
                }
            }
        }
    }

    .loginForm {
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
                background: transparent;
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

const Login = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm();

    const login = async data => {
        firebase.auth().signInWithEmailAndPassword(data.email, data.password).then(signInResponse => {
            dispatch(isVerified(signInResponse.user.emailVerified));
        })
    }

    const showRegisterForm = () => {
        dispatch(currentAuthComponent('register'));
    }

    const showPasswordReset = () => {
        dispatch(currentAuthComponent('passwordReset'));
    }

    return (
        <Styles>
            <form onSubmit={handleSubmit(login)} className="loginForm" noValidate>

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
                    <input className='inputField' type="password" placeholder="Password" name="password" ref={register({
                        required: 'Password is required'
                    })}></input>
                    <div className='validationContainer'>{errors.password && errors.password.message}</div>
                </div>

                <button className='submitButton' type="submit">Log in</button>
            </form>

            <div className='loginOptionsContainer'>
                <div className='optionContainer'>Don't have an account? <span className='optionLink' onClick={showRegisterForm}>Register</span></div>
                <div className='optionContainer'>Forget password? <span className='optionLink' onClick={showPasswordReset}>Reset password</span></div>
            </div>
        </Styles>
    )
}

export default Login;