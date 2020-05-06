import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm, useFieldArray } from "react-hook-form";
import { addDeviceFormValues, currentStep } from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import StepNavigationButton from './StepNavigationButton';
import { AddDeviceFormStyles } from '../../styles/components';
import { CustomButtonStyles } from '../../styles/components';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import Colors from '../../styles/colors';

const Styles = styled.div`
        width: 90%;
        height: 90%;
        margin: auto;
        display: flex;
        align-items: center;
        padding-top: 50px;

        .addAudioContainer {
            display: flex;
            width: 100%;
            justify-content: space-around;

            .addAudioSection {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 250px;

                .svg {
                    pointer-events: none;
                }

                .inputListTitle {
                    font-weight: bold;
                }

                .fieldList {
                    list-style: none;
                    margin: 10px;
                    padding: 0;

                    .inputListItem {
                        display: flex;
                        align-items: center;
                        position: relative;
                        z-index: 1;

                        .fieldIcons {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            height: 100%;
                            -webkit-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
                            -moz-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
                            box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
                            height: 40px;
                            position: relative;
                            right: 7px;
                            z-index: -1;
                            border-radius: 10px;

                            .confirmEditButton {
                                border-bottom: 1px solid ${Colors.lightGray} !important;
                                border-radius: 0 10px 0 0;
                            }

                            .deleteButton {
                                border-radius: 0 0 10px 0;
                            }

                            .fieldActionButton {
                                background-color: ${Colors.whiteBlue};
                                color: ${Colors.middleGray};
                                width: 35px;
                                border: none;
                                outline: none;
                                padding-left: 13px;
                                flex-grow: 1;

                                &:hover {
                                    background-color: ${Colors.middleGray};
                                    color: ${Colors.whiteBlue};
                                }

                                .confirmIcon {
                                    
                                }

                                .editIcon {

                                }

                                .deleteIcon {
                                    transform: rotate(45deg);
                                }
                            }
                        }
                    }
                }

                .inputContainer {
                    flex-direction: row !important;
                    position: relative;
                    width: 250px !important;
                }

                .addButton {
                    border-radius: 25px;
                    padding: 10px;
                    height: 25px;
                    cursor: pointer;
                    transition:0.1s;
                    -webkit-transition:0.1s;
                    -moz-transition:0.1s;

                    .addButtonSvg {
                        font-size: 25px;
                    }

                    &:hover {
                        transform: scale(1.2);
                    }
                }

                .inputField {
                    width: 100% !important;

                    &:disabled {
                        background-color: ${Colors.lightGray};
                    }
                }
            }
        }
    `;


const AudioStep = () => {

    library.add(faPlus, faCheck, faEdit);
    const dispatch = useDispatch();
    const { handleSubmit, register, control } = useForm();
    const formFieldValues = useSelector(state => state.addDeviceFormValues);
    const stepNumber = useSelector(state => state.currentStep);
    const audioOutLabel = 'output';
    const audioInLabel = 'input';
    const [audioOutFields, setAudioOutFields] = useState([]);
    const [audioInFields, setAudioInFields] = useState([]);
    const [editingFieldIds, setEditingFieldIds] = useState({
        'audioOut': '',
        'audioIn': ''
    });

    const storefields = audioType => {
        setAudioOutFields(updateValues('audioOut'));
        setAudioInFields(updateValues('audioIn'));
        updateFieldsToBeEdited(audioType, '');
    }

    const submitStep = async data => {
        const updatedData = formFieldValues;
        updatedData['audio'] = data;

        dispatch(addDeviceFormValues(updatedData));

        nextStep();
    }

    const nextStep = () => {
        dispatch(currentStep(stepNumber + 1));
    }

    const addField = audioType => {
        const newField = [
            {
                "name": "",
                "id": '_' + Math.random().toString(36).substr(2, 9),
                "value": ''
            }
        ]

        updateFieldsToBeEdited(audioType, newField[0].id);

        if (audioType === 'audioOut') {
            setAudioOutFields([...updateValues(audioType), ...newField]);
        } else if (audioType === 'audioIn') {
            setAudioInFields([...updateValues(audioType), ...newField]);
        }
    }

    const removeField = (audioType, id) => {
        const updatedFields = updateValues(audioType).filter(field => field.id !== id);
        if (audioType === 'audioOut') {
            setAudioOutFields(updatedFields);
        } else if (audioType === 'audioIn') {
            setAudioInFields(updatedFields);
        }
        updateFieldsToBeEdited(audioType, '');
    }

    const updateValues = audioType => {
        const updatedFields = [];
        const inputFields = document.getElementById('audioForm').elements;

        for (let field of inputFields) {
            if (field.tagName === 'INPUT' && field.getAttribute('audiooutorin') === audioType) {
                updatedFields.push({
                    "name": "",
                    "id": field.getAttribute('fieldid'),
                    "value": field.value
                });
            }
        }

        return updatedFields;
    }

    const updateFieldsToBeEdited = (audioType, fieldId) => {
        const updatedIds = editingFieldIds;
        updatedIds[audioType] = fieldId;
        setEditingFieldIds(updatedIds);
    }

    const AudioFields = props => {
        const { fields, append, remove } = useFieldArray({
            control,
            name: props.audioType
        });

        let storedFields = [];

        if (props.audioType === 'audioOut') {
            storedFields = audioOutFields;
        } else if (props.audioType === 'audioIn') {
            storedFields = audioInFields;
        }

        const editField = (audioType, fieldId) => {
            storefields(audioType);
            updateFieldsToBeEdited(audioType, fieldId);
        }

        const confirmField = audioType => {
            const fieldId = editingFieldIds[audioType];
            if (document.querySelector(`#${fieldId}`).value.length > 0) {
                storefields(audioType);
            } else {
                document.querySelector(`#${fieldId}`).classList.add('errorBox');
                setTimeout(() => {
                    document.querySelector(`#${fieldId}`).classList.remove('errorBox');
                }, 200);
                setTimeout(() => {
                    document.querySelector(`#${fieldId}`).classList.add('errorBox');
                }, 400);
                setTimeout(() => {
                    document.querySelector(`#${fieldId}`).classList.remove('errorBox');
                }, 600);
            }
        }

        return (
            <div className='addAudioSection'>
                {storedFields.length > 0 ?
                    < div className='inputListTitle'>Audio {
                        props.audioType === 'audioOut' ? audioOutLabel : audioInLabel
                    }s</div> : null
                }
                <ul className='fieldList'>
                    {storedFields.map((field, index) => (
                        <li className='inputListItem' key={field.id}>
                            <div className='inputContainer' >
                                <input id={field.id} disabled={editingFieldIds[props.audioType] !== field.id} audiooutorin={props.audioType} fieldname={field.name} fieldid={field.id} placeholder={`${
                                    props.audioType === 'audioOut' ? audioOutLabel : audioInLabel
                                    } name`} name={`${props.audioType}[${index}]`} defaultValue={field.value} className={`inputField ${editingFieldIds[props.audioType] !== field.id ? 'successBox' : ''}`} ref={register()} />
                            </div>
                            <div className='fieldIcons'>
                                {editingFieldIds[props.audioType] === field.id ?
                                    <button className='fieldActionButton confirmEditButton' type='button' onClick={() => confirmField(props.audioType)}>
                                        <FontAwesomeIcon className='svg' icon="check" />
                                    </button> :
                                    <button className='fieldActionButton confirmEditButton' type='button' onClick={() => editField(props.audioType, field.id)}>
                                        <FontAwesomeIcon className='svg' icon="edit" />
                                    </button>
                                }
                                <button className='fieldActionButton deleteButton' type='button' onClick={() => removeField(props.audioType, field.id)}>
                                    <FontAwesomeIcon className='deleteIcon svg' icon="plus" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                {storedFields.length > 0 ?
                    <>
                        {editingFieldIds[props.audioType].length === 0 ?
                            <div onClick={() => addField(props.audioType)} className='addButton'>
                                <FontAwesomeIcon className='addButtonSvg' icon="plus" />
                            </div> : null
                        }
                    </> :
                    <CustomButtonStyles>
                        <button onClick={() => addField(props.audioType)} type='button' className='customButton'>Add audio {
                            props.audioType === 'audioOut' ? audioOutLabel : audioInLabel
                        }s</button>
                    </CustomButtonStyles>
                }
            </div>
        )
    }

    AudioFields.propTypes = {
        audioType: PropTypes.string
    }

    return (
        <Styles>
            <AddDeviceFormStyles>
                <div className='formContainer'>
                    <form id='audioForm' name='audioForm' onSubmit={handleSubmit(submitStep)} className='form' autoComplete="off">
                        <div className='formFieldsContainer'>
                            <StepNavigationButton iconname='arrow-circle-left' />
                            <div className='fieldContainer'>
                                <div className='addAudioContainer'>
                                    {/* TODO field is disabled when clicking the other plus button */}
                                    <AudioFields audioType='audioOut' />
                                    <AudioFields audioType='audioIn' />
                                </div>
                            </div>
                            <StepNavigationButton next audioStep iconname='arrow-circle-right' />
                        </div>
                    </form>
                </div>
            </AddDeviceFormStyles>
        </Styles>
    )
}

export default AudioStep;