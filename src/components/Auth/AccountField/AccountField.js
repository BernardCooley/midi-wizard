import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import firebase from 'firebase';


const Styles = styled.div`
    .toggleInputField {
        text-decoration: underline;
        cursor: pointer;
    }

    .fieldOuterContainer {


        .errorMessage {
            color: red;
            height: 30px;
            padding: 10px;
            opacity: 0;
        }

        .show {
            opacity: 1;
        }

        .fieldContainer {
            display: flex;
            align-items: center;
            height: 30px;
            justify-content: center;

            .fieldInput {
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

const AccountField = props => {
    const user = firebase.auth().currentUser;
    const [displayField, setDisplayField] = useState(false);
    const [errorMessageDisplayed, setErrorMessageDisplayed] = useState(false);
    const [fieldValue, setFieldValue] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        validate();
    }, [fieldValue]);

    const saveDetail = () => {
        setErrorMessages([]);
        setErrorMessageDisplayed(false);
        setFieldValue(document.querySelector(`#${props.fieldid}`).value);

        if(props.fieldname === 'password') {
            if(errorMessages.length === 0) {
                // changePassword();
            }else {
                setErrorMessageDisplayed(true);
            }
        }else if(props.fieldname === 'email') {
            if(errorMessages.length === 0) {
                // changeEmail();
            }else {
                setErrorMessageDisplayed(true);
            }
        }
    }

    const toggleInput = () => {
        setDisplayField(!displayField);
    }

    const validate = () => {
        if(props.fieldname === 'email') {
            console.log('email');
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if(fieldValue.length < 1) {
                setErrorMessages([...errorMessages, 'Email must not be blank']);
            }
            if(emailRegex.test(String(fieldValue).toLowerCase())) {
                setErrorMessages([...errorMessages, 'Invalid email address']);
            }
        }else if(props.fieldname === 'password') {
            console.log('emaipassword');
            if(fieldValue.length < 6) {
                setErrorMessages(errorMessages.push('Password must be 6 character or longer'));
                setErrorMessageDisplayed(true);
            }
        }
        console.log(errorMessages);
    }

    const changePassword = () => {
        user.updatePassword(fieldValue).then(() => {
            setDisplayField(!displayField);
            setErrorMessageDisplayed(false);
            alert('Password updated successfully');
        }).catch(error => {
            console.error(error);
            alert('Something went wrong. Please try again.');
        });
    }

    const changeEmail = () => {
        user.updateEmail(fieldValue).then(() => {
            setDisplayField(!displayField);
            setErrorMessageDisplayed(false);
            alert('Email address updated successfully');
        }).catch(error => {
            console.error(error);
            alert('Something went wrong. Please try again.');
        });
    }

    return (
        <Styles>
            {!displayField ?
                <div onClick={toggleInput} className='toggleInputField'>{props.fieldtitle}</div>:
                <div className='fieldOuterContainer'>
                    <div className='fieldContainer'>
                        <input id={props.fieldid} className='fieldInput' name='fieldInput' type='text' placeholder={props.placeholder}></input>
                        <button className='saveButton' onClick={saveDetail}>Save</button>
                    </div>

                    {errorMessages.length > 0 ? errorMessages.map((message, index) => (
                        <div key={index} className={`errorMessage ${errorMessageDisplayed ? 'show' : ''}`}>{message}</div>
                    )):null}
                </div>
            }
        </Styles>
    )
}

export default AccountField;