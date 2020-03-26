import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import firebase from '../../firebase';
import { setSearchResults } from '../../actions';

const StockSearchResults = props => {

    const db = firebase.firestore();
    const userDataRef = db.collection('UserDeviceData');

    const dispatch = useDispatch();
    const stockDevices = useSelector(state => state.stockDevices);
    const userDevices = useSelector(state => state.userDevices);
    const userId = useSelector(state => state.currentUserId);
    const searchResults = useSelector(state => state.searchResults);

    useEffect(() => {
        dispatch(setSearchResults(getSearchResults(props.searchTerm)));
    }, [props.searchTerm, userDevices]);
    
    const getSearchResults = searchTerm => {
        const results = stockDevices.filter(device => 
            device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
        );
        results.forEach(device => {
            device.inDeviceTray = userDevices.filter(userDeviceId => userDeviceId === device.deviceId).length > 0 ? true : false;
        });
        return results;
    }

    const addToUserDevices = async e => {
        const deviceId = e.target.parentNode.getAttribute('deviceid');
        
        if(!doesUserAlreadyHaveDevice(deviceId)) {
            await userDataRef.doc(userId).update({
                devices: [...userDevices, deviceId]
            });
        }
    }

    const doesUserAlreadyHaveDevice = deviceId => {
        return userDevices.filter(userDeviceId => userDeviceId === deviceId).length > 0 ? true : false;
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
            fontSize: '20px'
        },
        button: {
            cursor: 'pointer',
            height: '30px',
            width: '100px'
        }
    }

    return (
        <div style={styles.stockSearchResultsContainer}>
            {
                searchResults.map((device, index) => (
                    <div key={index} deviceid={device.deviceId} style={styles.resultContainer}>
                        <div style={styles.result}>{device.manufacturer} - {device.deviceName}</div>
                        {device.inDeviceTray}
                        <button style={styles.button} disabled={device.inDeviceTray} onClick={addToUserDevices}>Add</button>
                    </div>
                ))
            }
        </div>
    )
}

export default StockSearchResults;