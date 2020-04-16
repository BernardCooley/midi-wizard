import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import firebase from '../../firebase';
import { selectedLayoutDeviceId } from '../../actions';
import { useDispatch } from 'react-redux';


const Styles = styled.div`
    .deviceContainer {
        width: 150px;
        height: 150px;
        margin: 50px;
        cursor: pointer;

        .layoutDeviceImage {
            width: 100%;
    
        }
    }
`;

const LayoutDevice = props => {

    const dispatch = useDispatch();

    const imageStorageRef = firebase.storage().ref();
    const db = firebase.firestore();
    const deviceDataRef = db.collection('DeviceData');
    const [imageUrl, setImageUrl] = useState({});

    useEffect(() => {
        getDeviceImage(props.device.imageName);
    }, []);

    const showOptions = e => {
        console.log(e.target.getAttribute('deviceid'));
        dispatch(selectedLayoutDeviceId(e.target.getAttribute('deviceid')));
    }

    const getDeviceImage = async () => {
        await getDeviceImageName()
            .then(async imageName => {
                const imageResponse = imageStorageRef.child('deviceImages').child(imageName);

                await imageResponse.getDownloadURL().then(url => {
                    setImageUrl(url);
                });
            });
    }

    const getDeviceImageName = async () => {
        const response = deviceDataRef.doc(props.device.deviceId).get();
        return (await response).data().imageName;
    }

    return (
        <Styles>
            <div className='deviceContainer'>
                <img deviceid={props.device.deviceId} onClick={showOptions} className='layoutDeviceImage' src={imageUrl} alt='device image'></img>

                <div className='deviceName'>
                    {props.device.deviceName}
                </div>
            </div>
        </Styles>
    )
}

LayoutDevice.propTypes = {
    device: PropTypes.object
}

export default LayoutDevice;