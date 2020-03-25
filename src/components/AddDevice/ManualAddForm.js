import React, {useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import { toggleAddDeviceForm } from '../../actions';
import firebase from '../../firebase';

const ManualAddForm = () => {

    const db = firebase.firestore();
    const stockDeviceDtaRef = db.collection('DeviceData');
    const userDataRef = db.collection('UserDeviceData');
    const dispatch = useDispatch();
    const stockDevices = useSelector(state => state.stockDevices);
    const [suggestions, setSuggestions] = useState([]);
    const { handleSubmit, register, errors } = useForm();
    const userDevices = useSelector(state => state.userDevices);
    const currentUserId = useSelector(state => state.currentUserId);

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
            }
        }

        addToUserDevices(addToStockDevices(newDevice), formData.audioIns, formData.audioOuts);
    }

    const addToStockDevices = async newDevice => {
        const newDocumentRef = await stockDeviceDtaRef.doc();
        await newDocumentRef.set(newDevice);
        newDevice['deviceId'] = newDocumentRef.id;
        newDocumentRef.set(newDevice);
        return newDocumentRef.id;
    }

    const addToUserDevices = async (newDocId, audioIns, audioOuts) => {
        const newUserDevice = {
            'deviceId': await newDocId,
            'midi': {
                'in': '',
                'out': '',
                'thru': ''
            },
            'audio': {
                'ins': Array(Number(audioIns)).join(".").split("."),
                'outs': Array(Number(audioOuts)).join(".").split(".")
            }
        }

        const updatedDevices = [...userDevices, newUserDevice];

        userDataRef.doc(currentUserId).update(
            {
                'devices': updatedDevices
        });
        dispatch(toggleAddDeviceForm(false));
        alert('Device added');
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
            height: '100%',
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
        }
    }

    return (
        <div style={styles.manualAddFormContainer} className='manualAddFormContainer'>
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
                <button type='submit' style={styles.submitButton} className='submitButton'>Add device</button>
            </form>
        </div>
    )
}

export default ManualAddForm;