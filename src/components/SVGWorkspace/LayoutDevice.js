import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import firebase from '../../firebase';
import { selectedLayoutDeviceId, connectionSelections } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../styles/colors';
import sweetAlert from 'sweetalert2';
import DonutChart from './DonutChart';


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
        position: relative;
        width: 150px;
        height: 150px;
        margin: 0 50px;
        cursor: pointer;
        transition: all .2s ease-in-out;
        display: flex;
        justify-content: center;
        align-items: center;

        .donutChartContainer {
            position: absolute;
            opacity: 0;
            transition:0.4s;
            -webkit-transition:0.4s;
            -moz-transition:0.4s;
            width: 10px;

            svg {
                overflow: visible;
            }
        }

        .optionsDisplayed {
            opacity: 1 !important;
            z-index: 20;
            width: 125px;
        }

        img {
            transition:0.4s;
            -webkit-transition:0.4s;
            -moz-transition:0.4s;
            
            &:hover{
                -webkit-box-shadow: 5px 8px 11px 0px ${Colors.black};
                -moz-box-shadow: 5px 8px 11px 0px ${Colors.black};
                box-shadow: 5px 8px 11px 0px ${Colors.black};
                transform: scale(1.1);
            }
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
            z-index: 10;
            opacity: 1;
        }

        .imageHidden {
            opacity: 0.4;
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

    const colors = {
        midiIn: 'black',
        midiOut: 'red',
        midiThru: 'blue',
        audioOut: 'green',
        audioIn: 'purple',
    }

    const dataMock = [
        { title: 'Midi in', value: 10, color: colors.midiIn },
        { title: 'Midi out', value: 10, color: colors.midiOut },
        { title: 'Midi thru', value: 10, color: colors.midiThru },
        { title: 'Audio out 1', value: 10, color: colors.audioOut },
        { title: 'Audio in 1', value: 10, color: colors.audioIn },
        { title: 'Audio out 2', value: 10, color: colors.audioOut },
        { title: 'Audio in 2', value: 10, color: colors.audioIn },
        { title: 'Audio out 3', value: 10, color: colors.audioOut },
        { title: 'Audio in 3', value: 10, color: colors.audioIn },
        { title: 'Audio out 4', value: 10, color: colors.audioOut },
        { title: 'Audio in 4', value: 10, color: colors.audioIn }
    ];

    useEffect(() => {
        getDeviceImage(props.device.imageName);

        document.addEventListener('click', e => {
            if (e.target.getAttribute('class')) {
                if (e.target.getAttribute('class').includes('svgWorkspaceContainer') || e.target.parentNode.getAttribute('class').includes('svgWorkspaceContainer')) {
                    dispatch(selectedLayoutDeviceId(''));
                }
            }
        })


    }, [props.device]);

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
            sweetAlert("Choose destination device");
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
        console.log('device clicked');
    }

    return (
        <Styles>
            <div className='deviceContainer'>
                <div deviceid={props.device.deviceId} className={`donutChartContainer ${selectedDeviceId === props.device.deviceId ? 'optionsDisplayed' : ''}`}>
                    <DonutChart className='donutContainer' data={dataMock}></DonutChart>
                </div>
                <img deviceid={props.device.deviceId} onClick={showConnectionOptions} className={`layoutDeviceImage ${selectedDeviceId === props.device.deviceId ? 'imageHidden' : ''}`} src={imageUrl} alt='device image'></img>
            </div>
        </Styles>
    )
}

LayoutDevice.propTypes = {
    device: PropTypes.object
}

export default LayoutDevice;