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
                    height: 45px;

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
    const [editingFieldId, setEditingFieldId] = useState('');

    const storeAllfields = () => {
        setAudioOutFields(updateValues('audioOut'));
        setAudioInFields(updateValues('audioIn'));
        setEditingFieldId('');
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

    const addField = audioOutOrIn => {
        const newField = [
            {
                "name": "",
                "id": '_' + Math.random().toString(36).substr(2, 9),
                "value": ''
            }
        ]
        setEditingFieldId(newField[0].id);
        if (audioOutOrIn === 'audioOut') {
            setAudioOutFields([...updateValues(audioOutOrIn), ...newField]);
        } else if (audioOutOrIn === 'audioIn') {
            setAudioInFields([...updateValues(audioOutOrIn), ...newField]);
        }
    }

    const removeField = (id, audioOutOrIn) => {
        const updatedFields = updateValues(audioOutOrIn).filter(field => field.id !== id);
        if (audioOutOrIn === 'audioOut') {
            setAudioOutFields(updatedFields);
        } else if (audioOutOrIn === 'audioIn') {
            setAudioInFields(updatedFields);
        }
    }

    const updateValues = audioOutOrIn => {
        const updatedFields = [];
        const inputFields = document.getElementById('audioForm').elements;

        for (let field of inputFields) {
            if (field.tagName === 'INPUT' && field.getAttribute('audiooutorin') === audioOutOrIn) {
                updatedFields.push({
                    "name": "",
                    "id": field.getAttribute('fieldid'),
                    "value": field.value
                });
            }
        }

        return updatedFields;
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

        const confirmField = () => {
            if (document.querySelector(`#${editingFieldId}`).value.length > 0) {
                storeAllfields();
            } else {
                document.querySelector(`#${editingFieldId}`).classList.add('errorBox');
                setTimeout(() => {
                    document.querySelector(`#${editingFieldId}`).classList.remove('errorBox');
                }, 200);
                setTimeout(() => {
                    document.querySelector(`#${editingFieldId}`).classList.add('errorBox');
                }, 400);
                setTimeout(() => {
                    document.querySelector(`#${editingFieldId}`).classList.remove('errorBox');
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
                                <input id={field.id} disabled={editingFieldId !== field.id} audiooutorin={props.audioType} fieldname={field.name} fieldid={field.id} placeholder={`${
                                    props.audioType === 'audioOut' ? audioOutLabel : audioInLabel
                                    } name`} name={`${props.audioType}[${index}]`} defaultValue={field.value} className='inputField' ref={register()} />
                            </div>
                            <div className='fieldIcons'>
                                {editingFieldId === field.id ?
                                    <button className='fieldActionButton confirmEditButton' type='button' onClick={confirmField}>
                                        <FontAwesomeIcon className='svg' icon="check" />
                                    </button> :
                                    <button className='fieldActionButton confirmEditButton' type='button' onClick={() => setEditingFieldId(field.id)}>
                                        <FontAwesomeIcon className='svg' icon="edit" />
                                    </button>
                                }
                                <button className='fieldActionButton deleteButton' type='button' onClick={() => removeField(field.id, props.audioType)}>
                                    <FontAwesomeIcon className='deleteIcon svg' icon="plus" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                {storedFields.length > 0 ?
                    <>
                        {editingFieldId.length === 0 ?
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