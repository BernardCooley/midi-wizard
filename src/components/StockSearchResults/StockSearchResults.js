import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import firebase from '../../firebase';

const StockSearchResults = props => {

    const db = firebase.firestore();
    const userDataRef = db.collection('UserDeviceData');

    const stockDevices = useSelector(state => state.stockDevices);
    const userDevices = useSelector(state => state.userDevices);
    const [filteredDevices, setFilteredDevices] = useState(stockDevices);
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

    const markExistingDevices = () => {
        filteredDevices.map(device => {
            device['inDeviceTray'] = userDevices.filter(userDevice => userDevice.deviceId === device.deviceId).length > 0 ? true : false;
        });
    }

    const addToUserDevices = async e => {
        const deviceId = e.target.parentNode.getAttribute('deviceid');
        
        if(!doesUserAlreadyHaveDevice(deviceId)) {
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

    const styles = {
        stockSearchResultsContainer: {

        },
        resultContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid gray'
        },
        result: {
            margin: '10px',
            fontSize: '30px'
        },
        button: {
            cursor: 'pointer',
            height: '50px',
            width: '100px'
        }
    }

    return (
        <div style={styles.stockSearchResultsContainer}>
            {
                filteredDevices.map((device, index) => (
                    <div key={index} deviceid={device.deviceId} style={styles.resultContainer}>
                        <div style={styles.result}>{device.manufacturer} - {device.deviceName}</div>
                        <button style={styles.button} disabled={device.inDeviceTray} onClick={addToUserDevices}>Add</button>
                    </div>
                ))
            }
        </div>
    )
}

export default StockSearchResults;