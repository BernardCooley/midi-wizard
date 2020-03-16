import React, {useEffect, useState} from 'react';
import Device from '../Device/Device';
import DeviceData from '../../data/deviceData';
import './DeviceList.scss';
import firebase from '../../firebase';

const DeviceList = (props) => {
    const db = firebase.firestore();
    const userDeviceDataRef = db.collection('UserDeviceData');
    const allDeviceDataRef = db.collection('DeviceData');

    const [allDeviceDetails, setAllDeviceDetails] = useState(DeviceData.DeviceData);
    const [userDeviceData, setUserDeviceData] = useState([]);

    useEffect(() => {
        getUserDeviceConfiguration(props.loggedInUserId);
    }, [props]);

    const getUserDeviceConfiguration = async userId => {
        let response = await userDeviceDataRef.doc(userId).get();
        const responseData = response.data();
        setUserDeviceData([responseData.devices]);
    }

    const setAllMidiConnections = () => {
        let currentDevice = getMasterClockDevice();

        allDeviceDetails[0].forEach((device, index) => {
            let match = getConnectionMatch(currentDevice)[0];

            if(match) {
                setAllDeviceDetails([setMidiConnection(allDeviceDetails[0].indexOf(currentDevice), match.name, isDeviceMasterClock(currentDevice))]);

                setAllDeviceDetails([setMidiConnection(allDeviceDetails[0].indexOf(match), currentDevice.name, "in")]);

                currentDevice = allDeviceDetails[0][index+1];
            }
        });
    }

    const isDeviceMasterClock = (device) => {
        return device === getMasterClockDevice() ? 'out' : 'thru';
    }

    const getConnectionMatch = (currentDevice) => {
        return allDeviceDetails[0].filter(device => 
            !currentDevice.midiDetails.out.connectedTo && currentDevice != device &&!device.midiDetails.in.connectedTo && device.midiDetails.thru.available
        )
    }

    const getMasterClockDevice = () => {
        return allDeviceDetails[0].filter(device => device.masterClock === true)[0];
    }

    const setMidiConnection = (device1Index, device2Name, inOutThru) => {
        let updatedDeviceDetails = allDeviceDetails[0];
        updatedDeviceDetails[device1Index].midiDetails[inOutThru].connectedTo = device2Name;
        return updatedDeviceDetails;
    }

    return(
        <div className="devicesListContainer">
            {userDeviceData.devices > 0 ? userDeviceData.devices.map((deviceDetails, index) => (
                <Device key={index} deviceDetails={deviceDetails}/>
            )):null}
        </div>
      );
}

export default DeviceList;