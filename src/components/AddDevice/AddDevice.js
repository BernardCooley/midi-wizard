import React from 'react';
import './AddDevice.scss';
import firebase from '../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAddDeviceForm } from '../../actions';

const AddDevice = () => {
    const db = firebase.firestore();
    const userDeviceDataRef = db.collection('UserDeviceData');
    const allDeviceDataRef = db.collection('DeviceData');
    
    const dispatch = useDispatch();

    const stockDevices = useSelector(state => state.stockDevices);
    const userDevices = useSelector(state => state.userDevices);
    const currentUserId = useSelector(state => state.currentUserId);
    const currentUsername = useSelector(state => state.currentUsername);
    const isAddDeviceFormOpen = useSelector(state => state.toggleAddDeviceForm);

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
            await userDeviceDataRef.doc(currentUserId).set(
                {
                    'devices': updatedDevices,
                    'username': currentUsername
            });
            dispatch(toggleAddDeviceForm(false));
        }else {
            alert('Already added to your studio');
        }
    }

    return(
        <div className="addDeviceContainer">
            {isAddDeviceFormOpen ? 
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
            </form>: 
            <div>
                <button onClick={() => dispatch(toggleAddDeviceForm(true))}>Add device</button>
            </div>}
        </div>
    )
}

export default AddDevice;