import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import firebase from '../../firebase';
import { CustomButton } from '../../styles/components';
import { selectedLayoutDeviceId, connectionSelections } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../styles/colors';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';

const Styles = styled.div`
    .connectionModalContainer {
        height: auto;
        width: 80%;
        margin: auto;
        position: absolute;
        top: 100px;
        background-color: ${Colors.whiteBlue};
        left: 120px;
        padding: 20px 0 50px 0;


        .connectionFormSection {
            width: 90%;
            margin: auto;
            height: auto;
            color: ${Colors.middleGray};

            .connectionSection {
                width: 100%;
                height: auto;
                border-radius: 30px;
                border: 1px solid ${Colors.lightGray};
                margin-bottom: 30px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;

                .sectionTitle {
                    text-align: center;
                    position: relative;
                    top: -15px;
                    background-color: ${Colors.whiteBlue};
                    padding: 0 10px;
                    font-size: 18px;
                    width: 60px;
                }

                .selectionOptionsContainer {
                    height: 150px;
                    width: 90%;
                    margin: 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .arrowIcon {
                        font-size: 40px;
                        color: ${Colors.darkGray};
                    }

                    .imageContainer {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;

                        .deviceImage {
                            width: 150px;
                        }
                    }

                    .sourceContainer {
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 300px;

                        .sourceMidiLabel {
                            font-size: 20px;
                            margin: 0 20px;
                        }
                    }

                    .destinationContainer {
                        height: 100%;
                        display: flex;
                        align-items: center;
                        width: 300px;

                        .destinationOptionsContainer {
                            width: 95%;
                            display: flex;
                            width: 100%;
                            justify-content: space-between;
                            align-items: center;

                            .connectionOptionsContainer {
                                display: flex;
                                flex-direction: column;

                                .connectionButton {
                                    width: 100px;
                                    height: 50px;
                                    margin: 10px;
                                    background-color: ${Colors.whiteBlue};
                                    border: 1px solid ${Colors.lightgray};
                                    cursor: pointer;
                                    font-size: 20px;
                                    outline: none;

                                    &:hover {
                                        transform: scale(1.1);
                                        background-color: ${Colors.darkTeal};
                                        color: ${Colors.whiteBlue}
                                    }
                                }

                                .connected {
                                    transform: scale(1.1);
                                    background-color: ${Colors.darkTeal};
                                    color: ${Colors.whiteBlue}
                                }
                            }
                        }
                    }
                }

                .midiIn {
                    flex-direction: row;
                }

                .midiOutThru {
                    flex-direction: row-reverse;
                }
            }
        }

        .connectionEditButtons {
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            margin: auto;
        }
    }
`;

const ConnectionModal = () => {

    library.add(faArrowLeft, faArrowRight);
    const dispatch = useDispatch();
    const db = firebase.firestore();
    const userLayoutDataRef = db.collection('UserLayouts');
    const stockDeviceDtaRef = db.collection('DeviceData');
    const imageStorageRef = firebase.storage().ref();
    const layout = useSelector(state => state.currentLayout);
    const [sourceDeviceImage, setSourceDeviceImage] = useState([]);
    const [destinationDeviceImage, setDestinationDeviceImage] = useState([]);
    const selections = useSelector(state => state.connectionSelections);

    useEffect(() => {
        getImages(selections);
    }, [layout]);

    const closeModal = () => {
        dispatch(selectedLayoutDeviceId(''));
        dispatch(connectionSelections(['', '']));
    }

    const getDeviceImage = async (imageName) => {
        const imageUrl = await imageStorageRef.child(`deviceImages/${imageName}`).getDownloadURL();
        return (await imageUrl);
    }

    const getImageName = async deviceId => {
        const response = stockDeviceDtaRef.doc(deviceId).get();
        return (await response).data().imageName;
    }

    const getImages = async selections => {
        getImageName(selections[0].deviceId).then(async imageName => {
            const url = await getDeviceImage(imageName);
            setSourceDeviceImage(url);
        });

        getImageName(selections[1].deviceId).then(async imageName => {
            const url = await getDeviceImage(imageName);
            setDestinationDeviceImage(url);
        });
    }

    const makeConnection = async e => {
        const connectionType = e.target.getAttribute('connectiontype');
        const deviceName = e.target.parentNode.getAttribute('devicename');
        const sourceType = e.target.parentNode.getAttribute('sourcetype');

        let layoutDestDevices = layout.devices.map(device => {
            if (device.deviceName === deviceName) {
                device.midi[connectionType] = selections[0].deviceName;
            }
            return device;
        });

        await userLayoutDataRef.doc(layout.layoutId).update({
            devices: layoutDestDevices
        });

        const layoutSourceDevices = layout.devices.map(device => {
            if (device.deviceName === selections[0].deviceName) {
                device.midi[sourceType] = deviceName;
            }
            return device;
        });

        await userLayoutDataRef.doc(layout.layoutId).update({
            devices: layoutSourceDevices
        });
    }

    const ImageContainer = props => {
        ImageContainer.propTypes = {
            imageurl: PropTypes.string,
            devicename: PropTypes.string
        }

        return (
            <div className='imageContainer'>
                <img className='deviceImage' src={props.imageurl} alt='device image'></img>
                <div>{props.devicename}</div>
            </div>
        )
    }

    const ButtonsContainer = props => {
        const buttons = [];

        ButtonsContainer.propTypes = {
            connectiontype: PropTypes.string,
            devicename: PropTypes.string,
            inbutton: PropTypes.string,
            outbutton: PropTypes.string,
            thrubutton: PropTypes.string
        }

        if (props.inbutton) { buttons.push('in') }
        if (props.outbutton) { buttons.push('out') }
        if (props.thrubutton) { buttons.push('thru') }

        return (
            <div sourcetype={props.connectiontype} className='connectionOptionsContainer' devicename={selections[1].deviceName}>
                {buttons.map((button, index) => (
                    <button key={index} type='button' className={`connectionButton ${isConnected(selections[0].deviceName, selections[1].deviceName, button) ? 'connected' : ''}`} connectiontype={button} onClick={makeConnection}>Midi {button}</button>
                ))}
            </div>
        )
    }

    const isConnected = (sourceDeviceName, destinationDeviceName, connectionType) => {
        const destinationMidiConnections = layout.devices.filter(device => device.deviceName === destinationDeviceName)[0].midi;

        if (connectionType === 'in') {
            return destinationMidiConnections.in === sourceDeviceName;
        }
        if (connectionType === 'out') {
            return destinationMidiConnections.out === sourceDeviceName;
        }
        if (connectionType === 'thru') {
            return destinationMidiConnections.thru === sourceDeviceName;
        }
    }

    const SourceContainer = props => {
        SourceContainer.propTypes = {
            imageurl: PropTypes.string,
            devicename: PropTypes.string,
            connectiontype: PropTypes.string
        }

        return (
            <div className={`sourceContainer ${props.connectiontype === 'in' ? 'midiIn' : 'midiOutThru'}`}>
                <div className='sourceMidiLabel'>Midi {props.connectiontype}</div>
                <div className='imageContainer'>
                    <img className='deviceImage' src={props.imageurl} alt='device image'></img>
                    <div>{props.devicename}</div>
                </div>
            </div>
        )
    }

    return (
        <Styles>
            <div className='connectionModalContainer'>
                <div className='connectionFormSection'>
                    <h2>Midi</h2>

                    <div className='connectionSection'>
                        <div className='selectionOptionsContainer midiIn'>
                            <div className='destinationContainer'>
                                <div className='destinationOptionsContainer'>
                                    <ImageContainer devicename={selections[1].deviceName} imageurl={destinationDeviceImage} />
                                    <ButtonsContainer connectiontype='in' devicename={selections[1].deviceName} outbutton thrubutton />
                                </div>
                            </div>
                            <FontAwesomeIcon className='svg arrowIcon' icon="arrow-right" />
                            <SourceContainer connectiontype='in' devicename={selections[0].deviceName} imageurl={sourceDeviceImage} />
                        </div>
                    </div>

                    <div className='connectionSection'>
                        <div className='selectionOptionsContainer midiOutThru'>
                            <div className='destinationContainer'>
                                <div className='destinationOptionsContainer midiOutThru'>
                                    <ImageContainer devicename={selections[1].deviceName} imageurl={destinationDeviceImage} />
                                    <ButtonsContainer connectiontype='out' devicename={selections[1].deviceName} inbutton />
                                </div>
                            </div>
                            <FontAwesomeIcon className='svg arrowIcon' icon="arrow-right" />
                            <SourceContainer connectiontype='out' devicename={selections[0].deviceName} imageurl={sourceDeviceImage} />
                        </div>
                    </div>

                    <div className='connectionSection'>
                        <div className='selectionOptionsContainer midiOutThru'>
                            <div className='destinationContainer'>
                                <div className='destinationOptionsContainer midiOutThru'>
                                    <ImageContainer devicename={selections[1].deviceName} imageurl={destinationDeviceImage} />
                                    <ButtonsContainer connectiontype='thru' devicename={selections[1].deviceName} inbutton />
                                </div>
                            </div>
                            <FontAwesomeIcon className='svg arrowIcon' icon="arrow-right" />
                            <SourceContainer connectiontype='thru' devicename={selections[0].deviceName} imageurl={sourceDeviceImage} />
                        </div>
                    </div>
                </div>

                <div className='connectionFormSection'>
                    <h2>Audio</h2>
                    <div className='connectionSection'>

                    </div>
                </div>

                <CustomButton>
                    <div className='connectionEditButtons'>
                        <button onClick={closeModal} className='customButton'>Close</button>
                    </div>
                </CustomButton>
            </div>
        </Styles>
    )
}

export default ConnectionModal;