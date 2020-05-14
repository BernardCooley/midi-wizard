import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import firebase from '../../firebase';
import { selectedLayoutDeviceId, connectionSelections } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../styles/colors';
import { ToastContainer, toast } from 'react-toastify';


const Styles = styled.div`
    .midiOptions {
        height: 30px;
        position: relative;
        top: 55px;

        img {
            position: relative;
            height: 100%;
            transform: rotate(180deg);
            height: 100%;

            svg {
                color: white;
            }
        }
    }

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

        .showOptions {
            display: flex;
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
    const [clickedDeviceId, setClickedDeviceId] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [showAudioOptions, setShowAudioOptions] = useState(false);
    const [optionsToShow, setOptionsToShow] = useState('midi');
    const selections = useSelector(state => state.connectionSelections);
    const layout = useSelector(state => state.currentLayout);
    const selectedDeviceId = useSelector(state => state.selectedLayoutDeviceId);

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
        setClickedDeviceId(e.target.getAttribute('deviceid'));
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
        const imageName = props.device.general.imageName;

        const imageResponse = imageStorageRef.child('deviceImages').child(imageName);

        await imageResponse.getDownloadURL().then(url => {
            setImageUrl(url);
        });
    }

    const showConnectionOptions = e => {
        dispatch(selectedLayoutDeviceId(e.target.getAttribute('deviceid')));
    }

    const displayOptions = buttonClicked => {
        console.log(buttonClicked);
    }

    const setOptionsList = () => {
        console.log('fb\fbd');
    }

    return (
        <Styles>
            <ToastContainer />
            <div className='midiOptions'>

            </div>
            <div className='deviceContainer'>
                <img deviceid={props.device.deviceId} onClick={showConnectionOptions, setOptionsList} className={`layoutDeviceImage ${selections[0].deviceId === props.device.deviceId || selections[1].deviceId === props.device.deviceId ? 'deviceSelected' : ''}`} src={imageUrl} alt='device image'></img>

                <div className='deviceName'>
                    {props.device.general.deviceName}
                </div>
            </div>
        </Styles>
    )
}

LayoutDevice.propTypes = {
    device: PropTypes.object
}

export default LayoutDevice;