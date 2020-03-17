import React from 'react';
import './Device.scss';
import { useSelector } from 'react-redux';
import firebase from 'firebase';

const Device = deviceDetails => {
    const device = deviceDetails.deviceDetails;

    // TODO getDownloadURL() returning an object. Extract url and assign to src of image
    const deviceImageName = device.imageName ? device.imageName : 'default_device_image.jpg';
    const deviceImageUrl = firebase.storage().ref().child(`deviceImages/${deviceImageName}`).getDownloadURL();

    const stockDevices = useSelector(state => state.stockDevices);
    const matchedStockDevice = stockDevices.filter(stockDevice => stockDevice.deviceId === device.deviceId)[0];

    return (
        <div className="deviceContainer">

            <div className='deviceContainer'>
                <img src='https://firebasestorage.googleapis.com/v0/b/midi-wizard-dev.appspot.com/o/deviceImages%2Fdefault_device_image.jpg?alt=media&token=3dfcdcc8-855c-4b68-b3f5-41cc1e13e2c7' alt=''></img>
                <div className='deviceTitle'>{matchedStockDevice.deviceName}</div>
            </div>
        </div>
    )
}

export default Device;