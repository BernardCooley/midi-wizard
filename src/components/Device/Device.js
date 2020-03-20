import React from 'react';
import './Device.scss';
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase';

const Device = (deviceDetails) => {
    const db = firebase.firestore();
    const device = deviceDetails.deviceDetails;

    const dispatch = useDispatch();
    // TODO getDownloadURL() returning an object. Extract url and assign to src of image
    const deviceImageName = device.imageName ? device.imageName : 'default_device_image.jpg';
    const deviceImageUrl = firebase.storage().ref().child(`deviceImages/${deviceImageName}`).getDownloadURL();

    const userDataRef = db.collection('UserDeviceData');

    const stockDevices = useSelector(state => state.stockDevices);
    const userDevices = useSelector(state => state.userDevices);
    const userId = useSelector(state => state.currentUserId);
    const matchedStockDevice = stockDevices.filter(stockDevice => stockDevice.deviceId === device.deviceId)[0];

    const addToWorkspace = async e => {
        e.preventDefault();
        const clickedDeviceId = e.target.parentElement.getAttribute('deviceId')
        const clickedDevice = userDevices.filter(device => device.deviceId === clickedDeviceId)[0];

        userDevices[userDevices.indexOf(clickedDevice)]['workspace'] = device.workspace ? false : true;

        // TODO BUG removes from workspace when clicking on device tray device
        userDataRef.doc(userId).update({ devices: userDevices});
    }

    return (
        <div onClick={addToWorkspace} deviceid={device.deviceId} className='deviceContainer'>
            <img src='https://firebasestorage.googleapis.com/v0/b/midi-wizard-dev.appspot.com/o/deviceImages%2Fdefault_device_image.jpg?alt=media&token=3dfcdcc8-855c-4b68-b3f5-41cc1e13e2c7' alt=''></img>
            <div className='deviceTitle'>{matchedStockDevice.deviceName}</div>
        </div>
    )
}

export default Device;