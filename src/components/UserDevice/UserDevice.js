import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase';
import DevieOptions from '../DeviceOptions/DevieOptions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt, faNetworkWired } from "@fortawesome/free-solid-svg-icons";

const UserDevice = (deviceDetails) => {
    library.add(faTrashAlt, faNetworkWired);
    const db = firebase.firestore();
    const device = deviceDetails.deviceDetails;
    const userDataRef = db.collection('UserDeviceData');

    const dispatch = useDispatch();
    // TODO getDownloadURL() returning an object. Extract url and assign to src of image
    const deviceImageName = device.imageName ? device.imageName : 'default_device_image.jpg';
    const deviceImageUrl = firebase.storage().ref().child(`deviceImages/${deviceImageName}`).getDownloadURL();

    const stockDevices = useSelector(state => state.stockDevices);
    const userDevices = useSelector(state => state.userDevices);
    const userId = useSelector(state => state.currentUserId);
    const matchedStockDevice = stockDevices.filter(stockDevice => stockDevice.deviceId === device.deviceId)[0];

    const addToWorkspace = async e => {
        console.log('add to workspace')
    }

    const deleteDevice = async e => {
        const confirmDelete = window.confirm("Delete from device tray");

        if(confirmDelete) {
            const clickedDeviceId = e.target.parentNode.parentNode.getAttribute('deviceid');

            const newUserDeviceList = userDevices.filter(device => device.deviceId != clickedDeviceId);

            await userDataRef.doc(userId).update({
                devices: newUserDeviceList
            });
        }
    }

    const styles = {
        deviceContainer: {
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '5px 10px'
        },
        deviceTrayOptions: {
            width: '87%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        img: {
            height: '130px',
            border: '0',
            pointerEvents: 'none'
        },
        svg: {
            pointerEvents: 'none'
        },
        deviceAction: {
            fontSize: '18px'
        },
        deleteIcon: {
            color: 'red'
        },
        addToWorkspaceIcon: {
            color: 'green'
        },
        deviceTitle: {

        },
        deviceActionContainer: {
            cursor: 'pointer'
        }
    }

    return (
        <div deviceid={device.deviceId} style={styles.deviceContainer}>
            <div style={styles.deviceTrayOptions}>
                <div style={styles.deviceActionContainer} onClick={deleteDevice}>
                    <FontAwesomeIcon style={{...styles.svg, ...styles.deviceAction, ...styles.deleteIcon}} icon="trash-alt" />
                </div>
                <div style={styles.deviceActionContainer} onClick={addToWorkspace}>
                    <FontAwesomeIcon style={{...styles.svg, ...styles.deviceAction, ...styles.addToWorkspaceIcon}} icon="network-wired" />
                </div>
            </div>
            <img style={styles.img} src='https://firebasestorage.googleapis.com/v0/b/midi-wizard-dev.appspot.com/o/deviceImages%2Fdefault_device_image.jpg?alt=media&token=3dfcdcc8-855c-4b68-b3f5-41cc1e13e2c7' alt=''></img>
            <div style={styles.deviceTitle}>{matchedStockDevice.deviceName}</div>
        </div>
    )
}

export default UserDevice;