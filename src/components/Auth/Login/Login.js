import React from 'react';
import firebase from '../../../firebase';
import styled from 'styled-components';
import { isVerified, currentAuthComponent } from '../../../actions';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { AuthFormContainer, AuthFormField, AuthFormOptions, CustomButton, AuthFormValidationMessage } from '../../../styles/components';


const Styles = styled.div``;

const Login = () => {

    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
            <AuthFormContainer>
                <form onSubmit={handleSubmit(login)} className="formContainer" noValidate>

                    <AuthFormField>
                        <div className='fieldContainer'>
                            <input className={`inputField ${errors.email ? 'errorBorder' : ''}`} type="email" placeholder="Email" name="email" ref={register({
                                required: 'Email address is required',
                                pattern: {
                                    value: emailRegex,
                                    message: 'Email address invalid'
                                }
                            })}></input>
                            <AuthFormValidationMessage>
                                <div className='validationContainer'><span className={errors.email ? 'errorBackground' : ''}>{errors.email && errors.email.message}</span></div>
                            </AuthFormValidationMessage>
                        </div>
                    </AuthFormField>

                    <AuthFormField>
                        <div className='fieldContainer'>
                            <input className={`inputField ${errors.password ? 'errorBorder' : ''}`} type="password" placeholder="Password" name="password" ref={register({
                                required: 'Password is required'
                            })}></input>
                            <AuthFormValidationMessage>
                                <div className='validationContainer'><span className={errors.password ? 'errorBackground' : ''}>{errors.password && errors.password.message}</span></div>
                            </AuthFormValidationMessage>
                        </div>
                    </AuthFormField>

                    <CustomButton>
                        <button className='customButton' type="submit">Log in</button>
                    </CustomButton>
                </form>
            </AuthFormContainer>

            <AuthFormOptions>
                <div className='optionsContainer'>
                    <div className='optionContainer'>Don't have an account? <span className='optionLink' onClick={showRegisterForm}>Register</span></div>
                    <div className='optionContainer'>Forget password? <span className='optionLink' onClick={showPasswordReset}>Reset password</span></div>
                </div>
            </AuthFormOptions>
        </Styles>
    )
}

export default Login;