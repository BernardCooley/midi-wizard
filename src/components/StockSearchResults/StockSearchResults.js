import React, { useEffect, useState } from 'react';
import './StockSearchResults.scss';
import { useSelector } from 'react-redux';
import firebase from '../../firebase';

const StockSearchResults = props => {

    const db = firebase.firestore();
    const userDataRef = db.collection('UserDeviceData');

    const stockDevices = useSelector(state => state.stockDevices);
    const userDevices = useSelector(state => state.userDevices);
    const [filteredDevices, setFilteredDevices] = useState([]);
    const userId = useSelector(state => state.currentUserId);

    useEffect(() => {
        setFilteredDevices(getSearchResults(props.searchTerm));
        markExistingDevices(filteredDevices);
    }, [props]);
    
    const getSearchResults = searchTerm => {
        return stockDevices.filter(device => 
            device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    const markExistingDevices = filteredResults => {
        filteredResults.map(device => {
            userDevices.filter(userDevice => userDevice.deviceId === device.deviceId).length > 0 ? device['inDeviceTray'] = true : device['inDeviceTray'] = false;
            console.log(device);
        })
    }

    const addToDeviceTray = async e => {
        const deviceId = e.target.parentNode.getAttribute('deviceid');
        
        if(!doesUserAlreadyHaveDevice(deviceId)) {
            console.log(deviceId);

            const newDevice = {
                deviceId: deviceId,
                midi: {
                    in: '',
                    out: '',
                    thru: ''
                },
                workspace: false
            }

            await userDataRef.doc(userId).update({
                devices: [...userDevices, newDevice]
            });
        }
    }

    const doesUserAlreadyHaveDevice = deviceId => {
        return userDevices.filter(device => device.deviceId === deviceId).length > 0 ? true : false;
    }

    return (
        <div className='stockSearchResultsContainer'>
            {
                filteredDevices.map((device, index) => (
                    <div key={index} deviceid={device.deviceId} className='resultContainer'>
                        <div className='result'>{device.manufacturer} - {device.deviceName}</div>
                        <button disabled={device.inDeviceTray} onClick={addToDeviceTray}>Add</button>
                    </div>
                ))
            }
        </div>
    )
}

export default StockSearchResults;