import React, {useEffect, useState} from 'react';
import Device from '../Device/Device';
import DeviceData from '../../data/deviceData';
import './DeviceList.scss';

const DeviceList = () => {

    const [allDeviceDetails, setAllDeviceDetails] = useState(DeviceData.DeviceData);

    useEffect(() => {
        setAllMidiConnections();
    }, []);

    const setAllMidiConnections = () => {
        let currentDevice = getMasterClockDevice();
        let order = 1;

        allDeviceDetails[0].forEach((device, index) => {
            let match = getConnectionMatch(currentDevice)[0];

            if(match) {
                setAllDeviceDetails([setMidiConnection(allDeviceDetails[0].indexOf(currentDevice), match.name, isDeviceMasterClock(currentDevice))]);

                setAllDeviceDetails([setOrderNumber(allDeviceDetails[0].indexOf(currentDevice), order)]);
                
                // TODO Set order correctly

                setAllDeviceDetails([setMidiConnection(allDeviceDetails[0].indexOf(match), currentDevice.name, "in")]);
                setAllDeviceDetails([setOrderNumber(allDeviceDetails[0].indexOf(match), order)]);
                order++;

                currentDevice = allDeviceDetails[0][index+1];
            }
            // console.log(order);
        });

        console.log(allDeviceDetails[0]);
    }

    const setOrderNumber = (deviceIndex, orderNumber) => {
        console.log(deviceIndex)
        let updatedDeviceDetails = allDeviceDetails[0];
        updatedDeviceDetails[deviceIndex].order = orderNumber;
        return updatedDeviceDetails;
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
            {allDeviceDetails[0].map((deviceDetails, index) => (
                <Device key={index} deviceDetails={deviceDetails}/>
            ))}
        </div>
      );
}

export default DeviceList;