import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm, useFieldArray } from "react-hook-form";
import { addDeviceFormValues, currentStep } from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import StepNavigationButton from './StepNavigationButton';
import { AddDeviceFormStyles, CustomCheckBoxStyles } from '../../styles/components';
import Colors from '../../styles/colors';

const Styles = styled.div`
    width: 90%;
    height: 90%;
    margin: auto;
    display: flex;
    align-items: center;

    .imageUploadInput {
        font-size: 18px;
        display: flex;
    }

    .checkboxGroupTitle {
        position: relative;
        top: 69px;
        background-color: ${Colors.whiteBlue};
        font-weight: bold;
        padding: 10px;
    }

    .imageUploadLabel {
        position: relative;
        background-color: ${Colors.whiteBlue};
        font-weight: bold;
        padding: 10px;
        top: -43px;
    }

    .fieldList, .imageUploadContainer {
        list-style: none;
        padding-left: 0;
        width: 80%;
        display: flex;
        flex-wrap: wrap;
        border: 1px solid ${Colors.lightGray};
        padding: 20px;
        margin: auto;
        justify-content: space-between;
        border-radius: 15px;
        margin-top: 50px;
    }

    .imageContainer {
        justify-content: center;

        .imageUploadInput {
            -webkit-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
            -moz-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
            box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
        }

        .imageUploadInputContainer {


            .clearImageUploadField {
                margin-top: 10px;
                background-color: ${Colors.middleGray};
                color: ${Colors.white};
                padding: 5px;
                border: none;
                outline: none;

                &:hover {
                    background-color: ${Colors.darkTeal};
                }
            }    

            .imagePreview {
                width: 50%;
                margin: auto;
                margin-top: 20px;

                img {
                    width: 100%;
                }
            }        
        }
    }

    .hidden {
        visibility: hidden;
    }
`;


const GeneralStep = () => {

    const dispatch = useDispatch();
    const { handleSubmit, register, errors, control } = useForm();
    const formFieldValues = useSelector(state => state.addDeviceFormValues);
    const stepNumber = useSelector(state => state.currentStep);
    const [deviceTypeFields, setDeviceTypeFields] = useState([]);
    const [imageFieldPopulated, setImageFieldPopulated] = useState(false);
    const [imageFle, setImageFile] = useState('');

    useEffect(() => {
        setDeviceTypeFields(constructDeviceTypeFields(deviceTypes));
    }, []);

    const deviceTypes = [
        'speaker',
        'dj_mixer',
        'effects_pedal',
        'effects_processor',
        'control_surface',
        'audio_interface',
        'sequencer',
        'turntable',
        'headphones',
        'synthesizer',
        'drum_machine',
        'mixing_desk',
        'recorder',
        'midi_thru_box',
        'midi_merge_box',
        'clock_generator',
        'clock_generators'
    ]

    const constructDeviceTypeFields = (deviceTypessss) => {
        const typeFields = [];
        deviceTypessss.forEach(type => {
            typeFields.push({
                "name": "",
                "id": '_' + Math.random().toString(36).substr(2, 9),
                "value": type,
                "label": CapitalizeString(type.replace(/_/g, ' ')),
                "checked": false
            })
        });
        return typeFields;
    }

    const CapitalizeString = string => {
        string = string.split(" ");

        for (var i = 0, x = string.length; i < x; i++) {
            string[i] = string[i][0].toUpperCase() + string[i].substr(1);
        }

        return string.join(" ");
    }

    const submitStep = async data => {
        const updatedData = formFieldValues;

        if (!updatedData['general']) {
            updatedData['general'] = {};
        }

        updatedData.general['deviceName'] = data.deviceName;
        updatedData.general['manufacturer'] = data.manufacturer;

        const deviceTypes = [];

        Object.keys(data).forEach(key => {
            if (key !== 'deviceName' && key !== 'manufacturer' && key !== 'imageFile') {
                if (data[key]) {
                    deviceTypes.push(key);
                }
            }
        });

        updatedData['general']['deviceTypes'] = deviceTypes;

        dispatch(addDeviceFormValues(updatedData));
        nextStep();
    }

    const nextStep = () => {
        dispatch(currentStep(stepNumber + 1));
    }

    // eslint-disable-next-line no-unused-vars
    const { fields, append, remove } = useFieldArray({
        control,
        name: ''
    });

    const updateChecked = e => {
        const clickedCheckbox = e.target;

        setDeviceTypeFields(deviceTypeFields.map(field => {
            if (field.id === clickedCheckbox.id) {
                if (field.checked === true) {
                    field.checked = false;
                } else {
                    field.checked = true;
                }
            }
            return field;
        }));
    }

    const clearFileInput = () => {
        document.querySelector('#imageUploadInput').value = '';
        setImageFieldPopulated(false);
        setImageFile('');
    }

    const updateFilePath = () => {
        const localImageUrl = window.URL.createObjectURL(document.querySelector('#imageUploadInput').files[0]);
        const updatedData = formFieldValues;

        if (!updatedData['general']) {
            updatedData['general'] = {};
        }

        updatedData['general']['imageRef'] = localImageUrl

        dispatch(addDeviceFormValues(updatedData));
        setImageFile(localImageUrl);
    }

    return (
        <Styles>
            <AddDeviceFormStyles>
                <div className='formContainer'>
                    <div className='skip'></div>
                    <form name='generalForm' onSubmit={handleSubmit(submitStep)} className='form' autoComplete="off">
                        <p className='formInstructions'>Please fill out the form with as much detail as possible. You will be able to use your new device right away, but each new device will be reviewed and possibly updated by site admin, so details my change in your device if they are incorrect.</p>
                        <div className='formFieldsContainer'>
                            <div className='navPlaceholder'></div>
                            <div className='fieldContainer'>
                                <div className='inputContainer'>
                                    <div className='validationContainer'>{errors.manufacturer && errors.manufacturer.message}</div>
                                    <input className={`inputField ${errors.manufacturer ? 'errorBox' : ''}`} placeholder='Manufacturer' name="manufacturer" ref={register({
                                        required: 'Please enter manufacturer'
                                    })} />
                                </div>

                                <div className='inputContainer'>
                                    <div className='validationContainer'>{errors.deviceName && errors.deviceName.message}</div>
                                    <input className={`inputField ${errors.deviceName ? 'errorBox' : ''}`} placeholder='Device name' name="deviceName" ref={register({
                                        required: 'Please enter device name'
                                    })} />
                                </div>

                                <div className='checkboxGroupTitle'>Device types</div>
                                <ul className='fieldList'>
                                    {deviceTypeFields.map((field, index) => (
                                        <li className='inputListItem' key={index}>
                                            <CustomCheckBoxStyles>
                                                <div className='checkboxContainer' >
                                                    <label className='checkBoxLabel'>
                                                        {field.label}
                                                        <input checked={field.checked} onClick={updateChecked} id={field.id} type='checkbox' name={field.value} value={field.value} ref={register()} />
                                                        <span className='customCheckbox'></span>
                                                    </label>
                                                </div>
                                            </CustomCheckBoxStyles>
                                        </li>
                                    ))}
                                </ul>

                                <div className='imageContainer imageUploadContainer'>
                                    <div className='imageUploadLabel'>Device image</div>
                                    <div className='imageUploadInputContainer inputContainer'>
                                        <div className='validationContainer'>{errors.imageFile && 'Image files must be jpg, jpeg or png'}</div>
                                        <input onChange={() => { setImageFieldPopulated(true); updateFilePath() }} id='imageUploadInput' className='imageUploadInput' name="imageFile" ref={register({
                                            validate: files => files.length === 0 || files[0].name.includes('.jpg') || files[0].name.includes('.png') || files[0].name.includes('.jpeg')
                                        })} type="file" />
                                        <div className='imagePreview'>
                                            <img src={imageFle}></img>
                                        </div>
                                        <button onClick={clearFileInput} className={`clearImageUploadField ${!imageFieldPopulated ? 'hidden' : ''}`} type="button">Delete image</button>
                                    </div>
                                </div>
                            </div>
                            <StepNavigationButton next iconname='arrow-circle-right' />
                        </div>
                    </form>
                </div>
            </AddDeviceFormStyles>
        </Styles>
    )
}

export default GeneralStep;