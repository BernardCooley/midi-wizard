import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import { toggleAddDeviceForm } from '../../actions';
import firebase from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';


const Styles = styled.div`
    .manualAddFormContainer {
        width: 90%;
        margin: auto;

        .manualAddDeviceForm {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .detailsContainer {
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                margin: 10px 0px;

                .inputContainer {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: flex-start;

                    .inputField {
                        width: 80%;
                        font-size: 20px;
                        margin: 5px 0;
                        height: 30px;
                        text-align: center;
                    }

                    .manufacturerSuggestions {
                        min-height: 30px;

                        .suggentionItem {
                            cursor: pointer;
                        }
                    }

                    .numberFields {
                        text-align: center;
                    }
                }

                .imageUploadInput {
                    font-size: 18px;
                    display: flex;
                }

                .checkboxGroupContainer {
                    width: 400px;
                    display: flex;
                    flex-direction: column;

                    .checkboxGroupTitle {
                        font-size: 25px;
                    }

                    .checkboxInputContainer {
                        display: flex;
                        align-items: center;

                        .checkboxField {
                            height: 25px;
                            width: 25px;
                            cursor: pointer;
                        }

                        .checkboxLabel {
                            cursor: pointer;
                        }
                    }
                }

                .imageUploadLabel {
                    font-size: 25px;
                    margin-bottom: 10px;
                }

                .imageUploadInputContainer {
                    display: flex;

                    .clearImageUploadField {
                        margin-right: 10px;
                    }
                }

                .validationContainer {
                    color: red;
                    min-height: 20px;
                } 
            }

            .hidden {
                display: none;
            }

            .imageUploadContainer {
                margin-bottom: 30px;
            }

            .submitButton {
                width: 150px;
                height: 50px;
                font-size: 20px;
            }
        }
    }
`

const ManualAddForm = () => {

    const db = firebase.firestore();
    const stockDeviceDtaRef = db.collection('DeviceData');
    const userDataRef = db.collection('UserDeviceData');
    const imageStorageRef = firebase.storage().ref();

    const dispatch = useDispatch();
    const stockDevices = useSelector(state => state.stockDevices);
    const [suggestions, setSuggestions] = useState([]);
    const [imageFieldPopulated, setImageFieldPopulated] = useState(false);
    const { handleSubmit, register, errors } = useForm();
    const userDeviceIds = useSelector(state => state.userDeviceIds);
    const currentUserId = useSelector(state => state.currentUserId);

    const notify = message => {
        toast(message);
    };

    const searchManufacturers = e => {
        const searchTerm = e.target.value;

        if (searchTerm.length > 2) {
            const matchedDevices = stockDevices.filter(device => device.manufacturer.toLowerCase().includes(e.target.value.toLowerCase()));
            setSuggestions([...new Set(matchedDevices.map(devices => devices.manufacturer))]);
        } else if (searchTerm.length === 0) {
            setSuggestions([]);
        }
    }

    const setFieldValue = e => {
        const suggestionClicked = e.target.innerText;
        e.target.parentNode.parentNode.querySelector('input').value = suggestionClicked;
        setSuggestions([]);
    }

    const submitNewDevice = async data => {
        const formData = data;

        const imageName = formData.imageFile.length > 0 ? formData.imageFile[0].name : 'default_device_image.jpg';

        const imgeUrl = await firebase.storage().ref().child(`deviceImages/${imageName}`).getDownloadURL();

        const newDevice = {
            'deviceName': formData.deviceName,
            'manufacturer': formData.manufacturer,
            'midi': {
                'in': formData.midiIn === 'midiIn',
                'out': formData.midiOut === 'midiOut',
                'thru': formData.midiThru === 'midiThru',
            },
            'audio': {
                'ins': Number(formData.audioIns),
                'outs': Number(formData.audioOuts)
            },
            'imageName': imageName,
            'imageUrl': imgeUrl,
            'verified': false,
            'deviceTypes': formData.deviceType
        }

        addToUserDevices(addToStockDevices(newDevice));

        if (formData.imageFile.length > 0) {
            uploadImage(formData.imageFile[0]);
        }
    }

    const addToStockDevices = async newDevice => {
        const newDocumentRef = await stockDeviceDtaRef.doc();
        await newDocumentRef.set(newDevice);
        newDevice['deviceId'] = await newDocumentRef.id;
        await newDocumentRef.set(newDevice);
        return newDocumentRef.id;
    }

    const addToUserDevices = async (newDocId) => {
        const updatedDevices = [...userDeviceIds, await newDocId];

        userDataRef.doc(currentUserId).update(
            {
                'devices': updatedDevices
            }).then(() => {
                dispatch(toggleAddDeviceForm(false));
                notify('Device added');
            });
    }

    const uploadImage = async imageFile => {
        let imageUpload = await imageStorageRef.child('deviceImages').child(imageFile.name)

        await imageUpload.put(imageFile);
    }

    const clearFileInput = () => {
        document.querySelector('#imageUploadInput').value = '';
        setImageFieldPopulated(false);
    }

    return (
        <Styles>
            <div className='manualAddFormContainer'>
                <ToastContainer />
                <h2>No results found... add manually</h2>
                <form onSubmit={handleSubmit(submitNewDevice)} className='manualAddDeviceForm' autoComplete="off">
                    <div className='detailsContainer'>
                        <div className='inputContainer'>
                            <div className='validationContainer'>{errors.manufacturer && errors.manufacturer.message}</div>
                            <input className='inputField' placeholder="Manufacturer" name="manufacturer" onChange={searchManufacturers} ref={register({
                                required: 'Please enter manufacturer name'
                            })} />
                            <div className='manufacturerSuggestions'>
                                {suggestions.length > 0 ? suggestions.map((suggestion, index) => (
                                    <div key={index} className='suggentionItem' onClick={setFieldValue}>{suggestion}</div>
                                )) : null
                                }
                            </div>

                        </div>
                        <div className='inputContainer'>
                            <div className='validationContainer'>{errors.deviceName && errors.deviceName.message}</div>
                            <input className='inputField' placeholder="Device name" name="deviceName" ref={register({
                                required: 'Please enter device name'
                            })} />
                        </div>
                        <div className='checkboxGroupContainer'>
                            <div className='checkboxGroupTitle'>Device type</div>
                            <div className='checkboxInputContainer'>
                                <input className='checkboxField' type="checkbox" id='keyboard' name="deviceType" value="keyboard" ref={register()} />
                                <label className='checkboxLabel' htmlFor="keyboard"> Keyboard</label>
                            </div>
                            <div className='checkboxInputContainer'>
                                <input className='checkboxField' type="checkbox" id='synth' name="deviceType" value="synth" ref={register()} />
                                <label className='checkboxLabel' htmlFor="synth"> Synth</label>
                            </div>
                            <div className='checkboxInputContainer'>
                                <input className='checkboxField' type="checkbox" id='padController' name="deviceType" value="padController" ref={register()} />
                                <label className='checkboxLabel' htmlFor="padController"> Pad controller</label>
                            </div>
                        </div>
                    </div>
                    <div className='detailsContainer'>
                        <div className='inputContainer'>
                            <div className='validationContainer'>{errors.audioOuts && errors.audioOuts.message}</div>
                            <input className='inputField numberFields' type="number" placeholder="Audio outs" name="audioOuts" ref={register({
                                required: 'Please enter amount of audio outputs'
                            })} />
                        </div>
                        <div className='inputContainer'>
                            <div className='validationContainer'>{errors.audioIns && errors.audioIns.message}</div>
                            <input className='inputField numberFields' type="number" placeholder="Audio ins" name="audioIns" ref={register({
                                required: 'Please enter amount of audio inputs'
                            })} />
                        </div>
                        <div className='checkboxGroupContainer'>
                            <div className='validationContainer'></div>
                            <div className='checkboxGroupTitle'>Midi</div>
                            <div className='checkboxInputContainer'>
                                <input className='checkboxField' type="checkbox" id='midiIn' name="midiIn" value="midiIn" ref={register()} />
                                <label className='checkboxLabel' htmlFor="midiIn"> Midi in</label>
                            </div>
                            <div className='checkboxInputContainer'>
                                <input className='checkboxField' type="checkbox" id='midiOut' name="midiOut" value="midiOut" ref={register()} />
                                <label className='checkboxLabel' htmlFor="midiOut"> Midi out</label>
                            </div>
                            <div className='checkboxInputContainer'>
                                <input className='checkboxField' type="checkbox" id='midiThru' name="midiThru" value="midiThru" ref={register()} />
                                <label className='checkboxLabel' htmlFor="midiThru"> Midi thru</label>
                            </div>
                        </div>
                    </div>
                    <div className='detailsContainer imageUploadContainer'>
                        <div className='imageUploadLabel'>Device image</div>
                        <div className='imageUploadInputContainer inputContainer'>
                            <input onChange={() => setImageFieldPopulated(true)} id='imageUploadInput' className='imageUploadInput' name="imageFile" ref={register({
                                validate: files => files.length === 0 || files[0].name.includes('.jpg') || files[0].name.includes('.png') || files[0].name.includes('.jpeg')
                            })} type="file" />
                            <button onClick={clearFileInput} className={`clearImageUploadField ${!imageFieldPopulated ? 'hidden' : ''}`} type="button">X</button>
                        </div>
                        <div className='validationContainer'>{errors.imageFile && 'Image files must be jpg, jpeg or png'}</div>
                    </div>
                    <button type='submit' className='submitButton'>Add device</button>
                </form>
            </div>
        </Styles>
    )
}

export default ManualAddForm;