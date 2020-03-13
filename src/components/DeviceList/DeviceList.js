import React, {useEffect, useState} from 'react';
import Device from '../Device/Device';
import DeviceData from '../../data/deviceData';
import './DeviceList.scss';
import firebase from '../../firebase';

const DeviceList = () => {
    const db = firebase.firestore();
    const userDeviceDataRef = db.collection('UserDeviceData');
    const allDeviceDataRef = db.collection('DeviceData');

    const [allDeviceDetails, setAllDeviceDetails] = useState(DeviceData.DeviceData);
    const [userDeviceData, setUserDeviceData] = useState([]);
    let currentUserId = 'user1';

    useEffect(() => {
        getUserDeviceConfiguration(currentUserId);
    }, []);

    const getUserDeviceConfiguration = async (userId) => {
        let data = await userDeviceDataRef.get();
        setUserDeviceData(data.docs.map(doc => doc.data()).filter(user => user.userID === userId));
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
            {userDeviceData.length > 0 ? userDeviceData[0].devices.map((deviceDetails, index) => (
                <Device key={index} deviceDetails={deviceDetails}/>
            )):null}
        </div>
      );
}

export default DeviceList;