import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import firebase from '../../firebase';
import { useSelector, useDispatch } from 'react-redux';

const Styles = styled.div`
    .deviceCardContainer {
        width: 200px;
        background-color: floralwhite;
        margin: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        -webkit-box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
        -moz-box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
        box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
        min-height: 350px;

        .manufacturer {
            font-size: 16px;
            text-align: center;
        }

        .deviceName {
            font-size: 24px;
            text-align: center;
        }

        .cardImage {
            width: 100%;
            background-color: lightgray;
            height: auto;
            margin: 10px;
        }

        .addButton {
            cursor: pointer;
            height: 30px;
            width: 100px;
        }
    }
`

const SearchResultsCard = props => {

    const device = props.device;
    const db = firebase.firestore();
    const userDataRef = db.collection('UserDeviceData');
    const imageStorageRef = firebase.storage().ref();

    const userId = useSelector(state => state.currentUserId);
    const userDeviceIds = useSelector(state => state.userDeviceIds);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        getImageUrl();
    }, [device]);

    const getImageUrl = async () => {
        const imageResponse = await imageStorageRef.child('deviceImages').child(device.imageName);

        await imageResponse.getDownloadURL().then(url => {
            setImageUrl(url);
        })
    }

    const addToUserDevices = async e => {
        const deviceId = e.target.getAttribute('deviceid');

        if(!doesUserAlreadyHaveDevice(deviceId)) {
            await userDataRef.doc(userId).update({
                devices: [...userDeviceIds, deviceId]
            });
        }
    }

    const doesUserAlreadyHaveDevice = deviceId => {
        return userDeviceIds.filter(userDeviceId => userDeviceId === deviceId).length > 0 ? true : false;
    }

    return (
        <Styles>
            <div className='deviceCardContainer'>
                <div className='manufacturer'>{device.manufacturer}</div>
                <div className='deviceName'>{device.deviceName}</div>
                <img src={imageUrl} className='cardImage'></img>
                <button deviceid={device.deviceId} className='addButton' disabled={device.inDeviceTray} onClick={addToUserDevices}>Add</button>
            </div>
        </Styles>
    )
}

export default SearchResultsCard;