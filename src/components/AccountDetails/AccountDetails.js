import React, { useState } from 'react';
import styled from 'styled-components';
import firebase from 'firebase';
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import { resetState } from '../../actions';
import { useDispatch } from 'react-redux';
import { CustomButtonStyles } from '../../styles/components';
import Colors from '../../styles/colors';


const Styles = styled.div`
    width: 100%;

    .logoutButton {
        position: absolute;
        bottom: 10px;
        right: 10px;
    }

    svg {
        pointer-events: none;
    }

    .accountDetailsForm {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: auto;

        .saveButton {

        }

        .fieldContainer {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            margin-bottom: 15px;

            .inputAndLabelContainer {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                width: 70%;
                margin: auto;
                justify-content: space-between;
                height: 70px;

                .fieldAndAction {
                

                    .fieldAndActionInner {
                        display: flex;
                        width: 350px;
                    }

                    input {
                        width: 100%;
                        height: 30px;
                        padding-left: 10px;
                    }

                    .editAccountDetailContainer {
                        margin: 3px;
                        position: relative;
                        right: 25px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 40;
                        width: 10px;
                        cursor: pointer;

                        .editIcon {
                            color: ${Colors.lightGray};
                        }

                        .checkIcon {
                            color: ${Colors.middleGray};
                        }
                    }

                    .validationContainer {
                        color: ${Colors.red};
                        min-height: 25px;
                        width: 100%;
                    } 
                }
            }
        }
    }
`;

const AccountDetails = () => {

    const dispatch = useDispatch();
    const user = firebase.auth().currentUser;
    const [fieldToEdit, setFieldToEdit] = useState('');
    const { handleSubmit, register } = useForm();
    library.add(faEdit, faCheck);
    const [fieldValue, setFieldValue] = useState('');

    const updateAccountDetails = async data => {
        const confirmUpdate = window.confirm("Are you sure you want to update your account details?");

        if (confirmUpdate) {
            await updatePassword(data.password).then(() => {
                setFieldToEdit('');
                alert('Password updated');
            });
        }
    }

    const updatePassword = async password => {
        return user.updatePassword(password).then(() => {

        }).catch(error => {
            console.error(error);
        });
    };

    const enableEdit = e => {
        if (fieldToEdit === '') {
            setFieldToEdit(e.target.getAttribute('fieldname'));
        } else {
            handleSubmit(updateAccountDetails);
            setFieldToEdit('');
        }
    }

    const updateFieldValue = e => {
        setFieldValue(e.target.value);
    }

    const logout = () => {
        firebase.auth().signOut().then(() => {
            dispatch(resetState());
        })
    }

    return (
        <Styles>
            <form onSubmit={handleSubmit(updateAccountDetails)} className="accountDetailsForm" autoComplete="off" noValidate>
                <div className='fieldContainer'>
                    <div className='inputAndLabelContainer'>
                        <label htmlFor='password'>Password: </label>
                        <div className='fieldAndAction'>
                            <div className='fieldAndActionInner'>
                                <input onChange={updateFieldValue} type="password" placeholder='******' name="password" disabled={fieldToEdit === 'password' ? false : true} ref={register({})}></input>
                                <div fieldname='password' onClick={enableEdit} className='editAccountDetailContainer'>
                                    {fieldToEdit === 'password' ?
                                        <FontAwesomeIcon className='svg checkIcon' icon="check" /> :
                                        <FontAwesomeIcon className='svg editIcon' icon="edit" />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <CustomButtonStyles>
                    <button type="submit" className='saveButton customButton' disabled={fieldValue.length < 6}>Save</button>
                </CustomButtonStyles>
            </form>
            <CustomButtonStyles>
                <button className='logoutButton customButton' onClick={logout}>Logout</button>
            </CustomButtonStyles>
        </Styles>
    )
}

export default AccountDetails;