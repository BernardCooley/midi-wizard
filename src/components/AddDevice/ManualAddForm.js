import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import { toggleAddDeviceForm } from '../../actions';
import firebase from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        
        if(searchTerm.length > 2) {
            const matchedDevices = stockDevices.filter(device => device.manufacturer.toLowerCase().includes(e.target.value.toLowerCase()));
            setSuggestions([...new Set(matchedDevices.map(devices => devices.manufacturer))]);
        }else if(searchTerm.length === 0) {
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
            'verified': false
        }

        addToUserDevices(addToStockDevices(newDevice));

        if(formData.imageFile.length > 0) {
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

    const styles = {
        manualAddFormContainer: {
            width: '90%',
            margin: 'auto'
        },
        manualAddDeviceForm: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
        },
        detailsContainer: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            margin: '10px 0px'
        },
        imageUploadContainer: {
            marginBottom: '30px'
        },
        imageUploadLabel: {
            fontSize: '25px',
            marginBottom: '10px'
        },
        imageUploadInputContainer: {
            display: 'flex'
        },
        clearImageUploadField: {
            marginRight: '10px'
        },
        imageUploadInput: {
            fontSize: '18px',
            display: 'flex'
        },
        manufacturerSuggestions: {
            minHeight: '30px'
        },
        inputContainer: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'flex-start'
        },
        checkboxGroupContainer: {
            width: '400px',
            display: 'flex',
            flexDirection: 'column'
        },
        checkboxInputContainer: {
            display: 'flex',
            alignItems: 'center'
        },
        manufacturerInputContainer: {
            
        },
        checkboxField: {
            height: '25px',
            width: '25px',
            cursor: 'pointer'
        },
        checkboxLabel: {
            cursor: 'pointer'
        },
        inputField: {
            width: '80%',
            fontSize: '20px',
            margin: '5px 0',
            height: '30px',
            textAlign: 'center'
        },
        checkboxGroupTitle: {
            fontSize: '25px'
        },
        suggentionItem: {
            cursor: 'pointer'
        },
        numberFields: {
            textAlign: 'center',
        },
        submitButton: {
            width: '150px',
            height: '50px',
            fontSize: '20px'
        },
        validationContainer: {
            color: 'red',
            minHeight: '20px'
        },
        hidden: {
            display: 'none'
        }
    }

    return (
        <div style={styles.manualAddFormContainer} className='manualAddFormContainer'>
            <ToastContainer />
            <h2>No results found... add manually</h2>
            <form onSubmit={handleSubmit(submitNewDevice)} style={styles.manualAddDeviceForm} className='manualAddDeviceForm' autoComplete="off">
                <div style={styles.detailsContainer} className='detailsContainer'>
                    <div style={styles.inputContainer} className='inputContainer'>
                        <div style={styles.validationContainer} className='validationContainer'>{errors.manufacturer && errors.manufacturer.message}</div>
                        <input style={styles.inputField} placeholder="Manufacturer" name="manufacturer" onChange={searchManufacturers} ref={register({
                            required: 'Please enter manufacturer name'
                        })}/>
                        <div style={styles.manufacturerSuggestions} className='manufacturerSuggestions'>
                            {suggestions.length > 0 ? suggestions.map((suggestion, index) => (
                                    <div key={index} style={styles.suggentionItem} className='suggentionItem' onClick={setFieldValue}>{suggestion}</div>
                                )):null
                            }
                        </div>
                        
                    </div>
                    <div style={styles.inputContainer} className='inputContainer'>
                        <div style={styles.validationContainer} className='validationContainer'>{errors.deviceName && errors.deviceName.message}</div>
                        <input style={styles.inputField} placeholder="Device name" name="deviceName" ref={register({
                            required: 'Please enter device name'
                        })}/>
                    </div>
                    <div style={styles.checkboxGroupContainer} className='checkboxGroupContainer'>
                        <div style={styles.checkboxGroupTitle} className='checkboxGroupTitle'>Device type</div>
                        <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                            <input style={styles.checkboxField} type="checkbox" id='keyboard' name="deviceType" value="keyboard" ref={register()}/>
                            <label style={styles.checkboxLabel} className='checkboxLabel' htmlFor="keyboard"> Keyboard</label>
                        </div>
                        <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                            <input style={styles.checkboxField} type="checkbox" id='synth' name="deviceType" value="synth" ref={register()}/>
                            <label style={styles.checkboxLabel} className='checkboxLabel' htmlFor="synth"> Synth</label>
                        </div>
                        <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                            <input style={styles.checkboxField} type="checkbox" id='padController' name="deviceType" value="padController" ref={register()}/>
                            <label style={styles.checkboxLabel} className='checkboxLabel' htmlFor="padController"> Pad controller</label>
                        </div>
                    </div>
                </div>
                <div style={styles.detailsContainer} className='detailsContainer'>
                    <div style={styles.inputContainer} className='inputContainer'>
                        <div style={styles.validationContainer} className='validationContainer'>{errors.audioOuts && errors.audioOuts.message}</div>
                        <input style={{...styles.inputField, ...styles.numberFields}} type="number" placeholder="Audio outs" name="audioOuts" ref={register({
                            required: 'Please enter amount of audio outputs'
                        })}/>
                    </div>
                    <div style={styles.inputContainer} className='inputContainer'>
                        <div style={styles.validationContainer} className='validationContainer'>{errors.audioIns && errors.audioIns.message}</div>
                        <input style={{...styles.inputField, ...styles.numberFields}} type="number" placeholder="Audio ins" name="audioIns" ref={register({
                            required: 'Please enter amount of audio inputs'
                        })}/>
                    </div>
                    <div style={styles.checkboxGroupContainer} className='checkboxGroupContainer'>
                        <div style={styles.validationContainer} className='validationContainer'></div>
                        <div style={styles.checkboxGroupTitle} className='checkboxGroupTitle'>Midi</div>
                        <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                            <input style={styles.checkboxField} type="checkbox" id='midiIn' name="midiIn" value="midiIn" ref={register()}/>
                            <label style={styles.checkboxLabel} className='checkboxLabel' htmlFor="midiIn"> Midi in</label>
                        </div>
                        <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                            <input style={styles.checkboxField} type="checkbox" id='midiOut' name="midiOut" value="midiOut" ref={register()}/>
                            <label style={styles.checkboxLabel} className='checkboxLabel' htmlFor="midiOut"> Midi out</label>
                        </div>
                        <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                            <input style={styles.checkboxField} type="checkbox" id='midiThru' name="midiThru" value="midiThru" ref={register()}/>
                            <label style={styles.checkboxLabel} className='checkboxLabel' htmlFor="midiThru"> Midi thru</label>
                        </div>
                    </div>
                </div>
                <div style={styles.imageUploadContainer} className='detailsContainer'>
                    <div style={styles.imageUploadLabel} className='imageUploadLabel'>Device image</div>
                    <div style={styles.imageUploadInputContainer} className='inputContainer'>
                        <input onChange={() => setImageFieldPopulated(true)} id='imageUploadInput' style={styles.imageUploadInput} className='imageUploadInput' name="imageFile" ref={register({
                            validate: files => files.length === 0 || files[0].name.includes('.jpg') || files[0].name.includes('.png') || files[0].name.includes('.jpeg')
                        })} type="file" />
                        <button onClick={clearFileInput} style={{...styles.clearImageUploadField, ...!imageFieldPopulated ? styles.hidden : ''}} className='clearImageUploadField' type="button">X</button>
                    </div>
                    <div style={styles.validationContainer} className='validationContainer'>{errors.imageFile && 'Image files must be jpg, jpeg or png'}</div>
                </div>
                <button type='submit' style={styles.submitButton} className='submitButton'>Add device</button>
            </form>
        </div>
    )
}

export default ManualAddForm;