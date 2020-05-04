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
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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

            .inputListTitle {
                font-weight: bold;
            }

            .fieldList {
                list-style: none;
                margin: 10px;
                padding: 0;

                li {
                    display: flex;
                    align-items: center;

                    .deleteButton {
                        position: relative;
                        height: 42px;
                        border-radius: 0 10px 10px 0;
                        border: none;
                        outline: none;
                        text-align: right;
                        font-size: 16px;
                        transition:0.2s;
                        -webkit-transition:0.2s;
                        -moz-transition:0.2s;
                        right: 22px;

                        &:hover {
                            background-color: ${Colors.middleGray};
                            color: ${Colors.whiteBlue};
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
                transition:0.2s;
                -webkit-transition:0.2s;
                -moz-transition:0.2s;

                .svg {
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

    library.add(faPlus);
    const dispatch = useDispatch();
    const { handleSubmit, register, control } = useForm();
    const formFieldValues = useSelector(state => state.addDeviceFormValues);
    const stepNumber = useSelector(state => state.currentStep);
    const audioOutLabel = 'output';
    const audioInLabel = 'input';
    const [audioOutFields, setAudioOutFields] = useState([]);
    const [audioInFields, setAudioInFields] = useState([]);

    const storeAllfields = () => {
        setAudioOutFields(updateValues('audioOut'));
        setAudioInFields(updateValues('audioIn'));
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
                                <input onBlur={storeAllfields} audiooutorin={props.audioType} fieldname={field.name} fieldid={field.id} placeholder={`${
                                    props.audioType === 'audioOut' ? audioOutLabel : audioInLabel
                                    } name`} name={`${props.audioType}[${index}]`} defaultValue={field.value} className='inputField' ref={register()} />
                            </div>
                            <button className='deleteButton' type='button' onClick={() => removeField(field.id, props.audioType)}>X</button>
                        </li>
                    ))}
                </ul>
                {storedFields.length > 0 ?
                    <div onClick={() => addField(props.audioType)} className='addButton'>
                        <FontAwesomeIcon className='svg' icon="plus" />
                    </div> :
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