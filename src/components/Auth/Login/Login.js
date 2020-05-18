import React, { useState } from 'react';
import firebase from '../../../firebase';
import styled from 'styled-components';
import { isVerified, currentAuthComponent } from '../../../actions';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { AuthFormContainerStyles, AuthFormFieldStyles, AuthFormOptionsStyles, CustomButtonStyles, AuthFormValidationMessageStyles } from '../../../styles/components';
import Colors from '../../../styles/colors';


const Styles = styled.div`
    .loginFailedMessage {
        color: ${Colors.whiteBlue};
        font-size: 20px;
        margin-bottom: 10px;
        height: 30px;
    }
`;

const Login = () => {

    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm();
    const [loginErrorMessage, setLoginErrorMessage] = useState('');

    const login = async data => {
        firebase.auth().signInWithEmailAndPassword(data.email, data.password).then(response => {
            setLoginErrorMessage('');
            dispatch(isVerified(response.user.emailVerified));
        }).catch(() => {
            setLoginErrorMessage('Email or password incorrect. Please try again.');
        });
    }

    const showRegisterForm = () => {
        dispatch(currentAuthComponent('register'));
    }

    const showPasswordReset = () => {
        dispatch(currentAuthComponent('passwordReset'));
    }

    return (
        <Styles>
            <AuthFormContainerStyles>
                <div className='loginFailedMessage'>
                    {loginErrorMessage.length > 0 ? loginErrorMessage : ''}</div>
                <form onSubmit={handleSubmit(login)} className="formContainer" noValidate>

                    <AuthFormFieldStyles>
                        <div className='fieldContainer'>
                            <input className={`inputField ${errors.email ? 'errorBorder' : ''}`} type="email" placeholder="Email" name="email" ref={register({
                                required: 'Email address is required',
                                pattern: {
                                    value: emailRegex,
                                    message: 'Email address invalid'
                                }
                            })}></input>
                            <AuthFormValidationMessageStyles>
                                <div className='validationContainer'><span className={errors.email ? 'errorBackground' : ''}>{errors.email && errors.email.message}</span></div>
                            </AuthFormValidationMessageStyles>
                        </div>
                    </AuthFormFieldStyles>

                    <AuthFormFieldStyles>
                        <div className='fieldContainer'>
                            <input className={`inputField ${errors.password ? 'errorBorder' : ''}`} type="password" placeholder="Password" name="password" ref={register({
                                required: 'Password is required'
                            })}></input>
                            <AuthFormValidationMessageStyles>
                                <div className='validationContainer'><span className={errors.password ? 'errorBackground' : ''}>{errors.password && errors.password.message}</span></div>
                            </AuthFormValidationMessageStyles>
                        </div>
                    </AuthFormFieldStyles>

                    <CustomButtonStyles>
                        <button className='customButton' type="submit">Log in</button>
                    </CustomButtonStyles>
                </form>
            </AuthFormContainerStyles>

            <AuthFormOptionsStyles>
                <div className='optionsContainer'>
                    <div className='optionContainer'>Don't have an account? <span className='optionLink' onClick={showRegisterForm}>Register</span></div>
                    <div className='optionContainer'>Forgot password? <span className='optionLink' onClick={showPasswordReset}>Reset password</span></div>
                </div>
            </AuthFormOptionsStyles>
        </Styles>
    )
}

export default Login;