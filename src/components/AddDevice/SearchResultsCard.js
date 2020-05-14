import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import firebase from '../../firebase';
import { useSelector } from 'react-redux';
import Colors from '../../styles/colors';

const Styles = styled.div`
    .deviceCardContainer {
        width: 200px;
        background-color: ${Colors.whiteBlueOpaque};
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
            background-color: ${Colors.lightgray};
            height: auto;
            margin: 10px;
        }

        .addButton {
            cursor: pointer;
            height: 30px;
            width: 100px;
            border: 1px solid ${Colors.whiteBlue};
            outline: none;
        }

        .enabled {
            background-color: ${Colors.middleGray};
            color: ${Colors.white};

            &:hover {
                background-color: ${Colors.darkTeal};
            }
        }
    }
`

const SearchResultsCard = props => {

    const device = props.device;
    const db = firebase.firestore();
    const usersRef = db.collection('Users');
    const imageStorageRef = firebase.storage().ref();

    const userId = useSelector(state => state.currentUserId);
    const existingUserDevices = useSelector(state => state.existingUserDevices);
    const userData = useSelector(state => state.userData);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        getImageUrl();
    }, [device]);

    const getImageUrl = async () => {
        const imageResponse = imageStorageRef.child('deviceImages').child(device.general.imageName);

        await imageResponse.getDownloadURL().then(url => {
            setImageUrl(url);
        })
    }

    const addToUserDevices = async () => {
        await usersRef.doc(userId).update({
            devices: [...existingUserDevices, device]
        });
    }

    return (
        <Styles>
            <div className='deviceCardContainer'>
                <div className='manufacturer'>{device.general.manufacturer}</div>
                <div className='deviceName'>{device.general.deviceName}</div>
                <img src={imageUrl} className='cardImage'></img>
                <button className={`addButton ${device.inDeviceTray ? '' : 'enabled'}`} disabled={device.inDeviceTray} onClick={addToUserDevices}>Add</button>
            </div>
        </Styles>
    )
}

SearchResultsCard.propTypes = {
    device: PropTypes.array
}

export default SearchResultsCard;