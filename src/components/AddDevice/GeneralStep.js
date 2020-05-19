import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm, useFieldArray } from "react-hook-form";
import { addDeviceFormValues, currentStep } from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import StepNavigationButton from './StepNavigationButton';
import { AddDeviceFormStyles } from '../../styles/components';
import Colors from '../../styles/colors';
import DeviceTypeIcons from '../ImportIcons/DeviceTypeIcons';
import firebase from '../../firebase';


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
        margin-bottom: 10px;
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

    .deviceTypeContainer {
        width: 85%;
        border: 1px solid lightgray;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 50px;

        .checkboxGroupTitle {
            position: relative;
            top: -45px;
            background-color: ${Colors.whiteBlue};
            font-weight: bold;
            padding: 10px;
        }

        .deviceTypes {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            
            .deviceType {
                display: flex;
                height: 40px;
                width: 160px;
                margin: 20px;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                padding: 5px;
                outline: 1px solid ${Colors.black};
                transition:0.2s;
                -webkit-transition:0.2s;
                -moz-transition:0.2s;
                justify-content: center;

                .deviceTypeLabel {
                    pointer-events: none;
                }

                &:hover {
                    transform: scale(1.1);
                    -webkit-box-shadow: 5px 8px 11px 0px ${Colors.middleGray};
                    -moz-box-shadow: 5px 8px 11px 0px ${Colors.middleGray};
                    box-shadow: 5px 8px 11px 0px ${Colors.middleGray};
                }

                .deviceTypeIcon {
                    height: auto;
                    width: 30px;
                    margin-right: 10px;
                    pointer-events: none;
                }
            }

            .selected {
                background-color: ${Colors.darkTeal};
                color: ${Colors.white};
                transform: scale(1.1);
                outline: none;
                -webkit-box-shadow: 5px 8px 11px 0px ${Colors.middleGray};
                -moz-box-shadow: 5px 8px 11px 0px ${Colors.middleGray};
                box-shadow: 5px 8px 11px 0px ${Colors.middleGray};
            }
        }
    }

    .valContainer {
        color: ${Colors.red};
        min-height: 20px;
        position: relative;
        top: -34px;
        z-index: 10;
    }
`;


const GeneralStep = () => {

    const dispatch = useDispatch();
    const formFieldValues = useSelector(state => state.addDeviceFormValues);
    const stepNumber = useSelector(state => state.currentStep);
    const [imageFieldPopulated, setImageFieldPopulated] = useState(false);
    const [imageFle, setImageFile] = useState('');
    const [selectedDeviceTypes, setSelectedDeviceTypes] = useState(formFieldValues['general'] ? formFieldValues['general']['deviceTypes'] : []);
    const [deviceTypesMessage, setDeviceTypesMessage] = useState('');
    const imageStorageRef = firebase.storage().ref();

    const { handleSubmit, register, errors, control } = useForm({
        defaultValues: {
            manufacturer: formFieldValues.general ? formFieldValues.general.manufacturer : '',
            deviceName: formFieldValues.general ? formFieldValues.general.deviceName : ''
        }
    });

    useEffect(() => {
        getImageUrl();
    }, [formFieldValues]);

    const getImageUrl = async () => {
        if (formFieldValues.general) {
            const imageResponse = imageStorageRef.child('deviceImages').child(formFieldValues.general.imageName);

            await imageResponse.getDownloadURL().then(url => {
                setImageFile(url);
            });
        }
    }

    const CapitalizeString = string => {
        string = string.split(" ");

        for (var i = 0, x = string.length; i < x; i++) {
            string[i] = string[i][0].toUpperCase() + string[i].substr(1);
        }

        return string.join(" ");
    }

    const submitStep = async data => {
        if (selectedDeviceTypes.length > 0) {
            setDeviceTypesMessage('');
            const updatedData = formFieldValues;

            if (!updatedData['general']) {
                updatedData['general'] = {};
            }

            updatedData.general['deviceName'] = data.deviceName;
            updatedData.general['manufacturer'] = data.manufacturer;
            updatedData.general['deviceTypes'] = selectedDeviceTypes;

            dispatch(addDeviceFormValues(updatedData));
            nextStep();
        } else {
            setDeviceTypesMessage('Please choose at least one device type.');
        }
    }

    const nextStep = () => {
        dispatch(currentStep(stepNumber + 1));
    }

    // eslint-disable-next-line no-unused-vars
    const { fields, append, remove } = useFieldArray({
        control,
        name: ''
    });

    const clearFileInput = () => {
        document.querySelector('#imageUploadInput').value = '';
        setImageFieldPopulated(false);
        setImageFile('');
    }

    const updateFilePath = () => {
        const file = document.querySelector('#imageUploadInput').files[0];
        const localImageUrl = window.URL.createObjectURL(file);
        const updatedData = formFieldValues;

        if (!updatedData['general']) {
            updatedData['general'] = {};
        }
        updatedData['general']['imageRef'] = localImageUrl;
        updatedData['general']['imageName'] = file.name;
        updatedData['general']['imageFile'] = file;

        dispatch(addDeviceFormValues(updatedData));
        setImageFile(localImageUrl);
    }

    const selectDeselect = e => {
        const clickedDeviceType = e.target.getAttribute('element');

        if (selectedDeviceTypes.includes(clickedDeviceType)) {
            setSelectedDeviceTypes(selectedDeviceTypes.filter(type => type !== clickedDeviceType));
        } else {
            setSelectedDeviceTypes([...selectedDeviceTypes, clickedDeviceType]);
        }
    }

    const DeviceTypes = () => {
        return (
            <div className='deviceTypes'>
                {Object.keys(DeviceTypeIcons).map((key, index) => (
                    <div className={`deviceType ${selectedDeviceTypes.includes(key) ? 'selected' : ''}`} element={key} key={index} onClick={selectDeselect}>
                        <img className='deviceTypeIcon' src={selectedDeviceTypes.includes(key) ? DeviceTypeIcons[key].light : DeviceTypeIcons[key].dark}></img>
                        <div className='deviceTypeLabel'>{CapitalizeString(key.replace(/_/g, ' '))}</div>
                    </div>
                ))}
            </div>
        )
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

                                <div className={`deviceTypeContainer ${deviceTypesMessage.length > 0 ? 'errorBox' : ''}`}>
                                    <div className='valContainer'>{deviceTypesMessage.length > 0 ? deviceTypesMessage : ''}</div>
                                    <div className='checkboxGroupTitle'>Device types</div>
                                    <DeviceTypes></DeviceTypes>
                                </div>

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