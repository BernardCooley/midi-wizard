import React from 'react';
import firebase from '../../../firebase';
import styled from 'styled-components';
import { currentAuthComponent } from '../../../actions';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { AuthFormContainerStyles, AuthFormFieldStyles, AuthFormOptionsStyles, CustomButtonStyles, AuthFormValidationMessageStyles } from '../../../styles/components';
import sweetAlert from 'sweetalert';


const Styles = styled.div``;

const PasswordReset = () => {

    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { register, handleSubmit, errors } = useForm();
    const dispatch = useDispatch();

    const sendPasswordResetEmail = data => {
        firebase.auth().sendPasswordResetEmail(data.email).then(function () {
            sweetAlert({
                title: 'Success',
                text: 'Password reset email sent.',
                icon: 'success',
                buttons: false,
                timer: 2000,
                className: ''
            });
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
            <AuthFormContainerStyles>
                <form onSubmit={handleSubmit(sendPasswordResetEmail)} className="formContainer" noValidate>
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

                    <CustomButtonStyles>
                        <button className='customButton' type="submit">Reset password</button>
                    </CustomButtonStyles>
                </form>
            </AuthFormContainerStyles>

            <AuthFormOptionsStyles>
                <div className='optionsContainer'>
                    <div className='optionContainer'><span className='optionLink' onClick={showLoginForm}>Back to login</span></div>
                </div>
            </AuthFormOptionsStyles>
        </Styles>
    )
}

export default PasswordReset;