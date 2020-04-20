import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import firebase from '../../firebase';
import { selectedLayoutDeviceId, connectionSelections } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../styles/colors';
import { ToastContainer, toast } from 'react-toastify';


const Styles = styled.div`
    .deviceContainer {
        width: 150px;
        height: 150px;
        margin: 50px;
        cursor: pointer;
        transition: all .2s ease-in-out;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &:hover{
            -webkit-box-shadow: 5px 8px 11px 0px ${Colors.black};
            -moz-box-shadow: 5px 8px 11px 0px ${Colors.black};
            box-shadow: 5px 8px 11px 0px ${Colors.black};
            transform: scale(1.06);
        }

        .deviceSelected {
            outline: 5px solid green;
            -webkit-box-shadow: 0px 0px 38px 0px ${Colors.brightGreen};
            -moz-box-shadow: 0px 0px 38px 0px ${Colors.brightGreen};
            box-shadow: 0px 0px 38px 0px ${Colors.brightGreen};
            transform: scale(1.06);
        }

        .layoutDeviceImage {
            width: 100%;
        }

        .deviceName {
            color: ${Colors.whiteBlue};
            text-align: center;
        }
    }
`;

const LayoutDevice = props => {

    const dispatch = useDispatch();

    const imageStorageRef = firebase.storage().ref();
    const db = firebase.firestore();
    const deviceDataRef = db.collection('DeviceData');
    const [imageUrl, setImageUrl] = useState({});
    const selections = useSelector(state => state.connectionSelections);
    const layout = useSelector(state => state.currentLayout);

    useEffect(() => {
        getDeviceImage(props.device.imageName);
    }, []);

    const notify = message => {
        toast(message);
    };

    const openConnectionModal = e => {
        dispatch(selectedLayoutDeviceId(e.target.getAttribute('deviceid')));
    }

    const getSelectedDevice = deviceId => {
        return layout.devices.filter(device => device.deviceId === deviceId)[0];
    }

    const makeSelection = e => {
        const clickedDeviceId = e.target.getAttribute('deviceid');
        if (selections[0].deviceId === undefined) {
            notify('Choose destination device');
            dispatch(connectionSelections([getSelectedDevice(clickedDeviceId), {}]));
        } if (selections[0].deviceId !== undefined) {
            dispatch(connectionSelections([selections[0], getSelectedDevice(clickedDeviceId)]));
            openConnectionModal(e);
        } if (selections[0].deviceId !== undefined && selections[1].deviceId !== undefined) {
            dispatch(connectionSelections([{}, {}]));
        }
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
            <ToastContainer />
            <div className='deviceContainer'>
                <img deviceid={props.device.deviceId} onClick={makeSelection} className={`layoutDeviceImage ${selections[0].deviceId === props.device.deviceId || selections[1].deviceId === props.device.deviceId ? 'deviceSelected' : ''}`} src={imageUrl} alt='device image'></img>

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