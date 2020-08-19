import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import firebase from '../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../styles/colors';

const Styles = styled.div`
    width: 32%;

    .deviceCardContainer {
        background-color: ${Colors.whiteBlueOpaque};
        margin: 10px 0;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        -webkit-box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
        -moz-box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
        box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
        height: 120px;
        padding: 15px;
        transition:0.2s;
        -webkit-transition:0.2s;
        -moz-transition:0.2s;
        cursor: pointer;
        outline: 1px solid ${Colors.black};
        overflow: hidden;

        &:hover {
            transform: scale(1.05);
            background-color: ${Colors.darkTeal};
            color: ${Colors.whiteBlue};
        }

        .detailContainer {
            flex-grow: 2;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .manufacturer {
                font-size: 16px;
                text-align: center;
            }

            .deviceName {
                font-size: 24px;
                text-align: left;
                max-width: 215px;
                max-height: 100px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
            }
        }

        .cardImageContainer {
            height: 100%;
            flex-grow: 2;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .cardImage {
                height: 100%;
                background-color: ${Colors.lightgray};
                margin: 10px;
            }
        }
    }

    .inTray {
        opacity: 0.5;
        pointer-events: none;
    }
`

const SearchResultsCard = props => {

    const db = firebase.firestore();
    const usersRef = db.collection('Users');
    const imageStorageRef = firebase.storage().ref();

    const userId = useSelector(state => state.currentUserId);
    const userData = useSelector(state => state.userData);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        getImageUrl();
    }, [props.device]);

    const getImageUrl = async () => {
        const imageResponse = imageStorageRef.child('deviceImages').child(props.device.general.imageName);

        await imageResponse.getDownloadURL().then(url => {
            setImageUrl(url);
        })
    }

    const addToUserDevices = async () => {
        document.querySelector('.addDeviceOuterContainer').classList.add('addingDevice');

        setTimeout(() => {
            document.querySelector('.addDeviceOuterContainer').classList.remove('addingDevice');
        }, 1000);

        props.device.inDeviceTray = true;
        await usersRef.doc(userId).update({
            devices: [...userData.devices, props.device]
        });
    }

    return (
        <Styles>
            <div className={`deviceCardContainer ${props.device.inDeviceTray ? 'inTray' : ''}`} onClick={addToUserDevices}>
                <div className='detailContainer'>
                    <div className='manufacturer'>{props.device.maker[0].title}</div>
                    <div className='deviceName'>{props.device.title}</div>
                </div>
                <div className='cardImageContainer'>
                    <img src={imageUrl} className='cardImage'></img>
                </div>
            </div>
        </Styles>
    )
}

SearchResultsCard.propTypes = {
    device: PropTypes.array
}

export default SearchResultsCard;