import React, { useState } from 'react';
import firebase from '../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAddDeviceForm } from '../../actions';
import StockSearchResults from '../StockSearchResults/StockSearchResults';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const AddDevice = () => {
    library.add(faTimesCircle);

    const db = firebase.firestore();
    const userDataRef = db.collection('UserDeviceData');
    const allDeviceDataRef = db.collection('DeviceData');
    
    const dispatch = useDispatch();

    const stockDevices = useSelector(state => state.stockDevices);
    const userDevices = useSelector(state => state.userDevices);
    const currentUserId = useSelector(state => state.currentUserId);
    const currentUsername = useSelector(state => state.currentUsername);
    const isAddDeviceFormOpen = useSelector(state => state.isAddDeviceFormOpen);
    const [searchTerm, setSearchTerm] = useState('');

    const addDevice = async (e) => {
        e.preventDefault();
        const newDeviceName = e.target.deviceName.value;
        const manufacturer = e.target.manufacturer.value;

        const newDevice = {
            'deviceName': newDeviceName,
            'manufacturer': manufacturer,
            'midi': 
                {
                    'in': e.target.midiIn.checked,
                    'out': e.target.midiOut.checked,
                    'thru': e.target.midiThru.checked
                }
        }

        addToUserDevices(addToStockDevices(newDevice), newDeviceName);
    }

    const doesDeviceExist = (deviceList, newDeviceName) => {
        return deviceList.filter(device => device.deviceName === newDeviceName).length > 0 ? true : false;
    }

    const addToStockDevices = async newDevice => {
        if(!doesDeviceExist(stockDevices, newDevice.deviceName)) {
            const newDocumentRef = await allDeviceDataRef.doc();
            await newDocumentRef.set(newDevice);
            newDevice['deviceId'] = newDocumentRef.id;
            newDocumentRef.set(newDevice);
            return newDocumentRef.id;
        }else {
            console.log('Already exists in database');
            return '';
        }
    }

    const addToUserDevices = async (newDocId, newDeviceName) => {

        const newUserDevice = {
            'deviceId': await newDocId,
            'midi': 
                {
                    'in': '',
                    'out': '',
                    'thru': ''
                }
        }

        if(!doesDeviceExist(userDevices, newDeviceName)) {
            const updatedDevices = [...userDevices, newUserDevice];

            userDataRef.doc(currentUserId).update(
                {
                    'devices': updatedDevices
            });
            dispatch(toggleAddDeviceForm(false));
        }else {
            alert('Already added to your studio');
        }
    }

    const updateSearchTerm = e => {
        let searchTerm = e.target.value;

        if(searchTerm.length > 2) {
            setSearchTerm(searchTerm);
        }else {
            setSearchTerm('');
        }
    }

    const toggleDeviceForm = open => {
        toggleAddDeviceForm(open);
    }


    const styles = {
        addDeviceContainer: {
            width: '90%',
            position: 'absolute',
            top: '100px',
            border: '1px solid lightgray',
            backgroundColor: 'white',
            padding: '20px',
            position: 'relative',
            zIndex: '10'
        },
        svg: {
            position: 'relative',
            right: '28px',
            top: '-29px',
            fontSize: '30px',
            cursor: 'pointer'
        },
        deviceSearchBox: {
            width: '98%',
            height: '50px',
            fontSize: '30px',
            padding: '10px',
            marginBottom: '30px'
        },
        addDeviceForm: {
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            margin: 'auto',
            padding: '50px'
        }
    }

    return(
        <div className="addDeviceContainer">

            <FontAwesomeIcon onClick={toggleDeviceForm(false)} icon="times-circle" />

            <input style={styles.deviceSearchBox} type='text' onChange={updateSearchTerm} placeholder='Search'></input>

            <StockSearchResults searchTerm={searchTerm}/>

            {/* {isAddDeviceFormOpen ? 
            <form className="addDeviceForm" onSubmit={addDevice} autoComplete="off">
                <div className="manufacturer">
                    <input type="text" placeholder="Manufacturer" name="manufacturer"></input>
                </div>
                <input type="text" placeholder="DeviceName" name="deviceName"></input>
                <div className="formField">
                    <input type="checkbox" value="Midi In" name="midiIn" id="midiIn"></input>
                    <label htmlFor="midiIn">Midi In</label>
                </div>
                <div className="formField">
                    <input type="checkbox" value="Midi Out" name="midiOut" id="midiOut"></input>
                    <label htmlFor="midiOut">Midi Out</label>
                </div>
                <div className="formField">
                    <input type="checkbox" value="Midi Thru" name="midiThru" id="midiThru"></input>
                    <label htmlFor="midiThru">Midi Thru</label>
                </div>
                <button type="submit">Add</button>
                <button onClick={() => dispatch(toggleAddDeviceForm(false))}>Cancel</button>
            </form>: null} */}
        </div>
    )
}

export default AddDevice;