import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { CustomButtonStyles } from '../../styles/components';
import Colors from '../../styles/colors';
import StepNavigationButton from './StepNavigationButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';
import firebase from '../../firebase';
import { toggleAddDeviceForm, addDeviceFormValues, currentStep } from '../../actions';
import sweetAlert from 'sweetalert2';

const Styles = styled.div`
    width: 90%;
    height: 90%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .customButton {
        margin-top: 50px;
    }

    .summaryContainer {
        display: flex;
        height: 100%;
        height: 100%;
        width: 100%;
        margin: auto;
        justify-content: space-between;
        margin-top: 30px;
        
        .summarySection {
            width: 30%;
            margin: 10px;
            display: flex;
            justify-content: flex-start;
            -webkit-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
            -moz-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
            box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
            flex-direction: column;
            align-items: center;
            padding-bottom: 20px;
            align-content: stretch;

            .midiContainer {
                display: flex;
                justify-content: space-between;

                .midiDetail {
                    text-align: center;
                }
            }

            .summarySectionTitle {
                position: relative;
                top: -17px;
                background-color: #f3f7ff;
                padding: 5px;
                -webkit-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
                -moz-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
                box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
                width: 100px;
                text-align: center;
            }

            .summaryDetails {
                width: 90%;
                height: auto;

                .imagePreview img {
                    width: 100%;
                }

                .detailContainer {
                    margin-bottom: 10px;
                }

                .audioSummary {
                    height: 100%;
                    width: 100%;
                    display: flex;

                    .audio {
                        height: 100%;
                        width: 50%;

                        .audioDetailContainer {

                            .audioDetail {
                                text-align: center;
                            }
                        }

                        .audioTitle {
                            text-align: center;
                        }
                    }
                }

                .detailTitle {
                    font-size: 14px;
                    font-weight: bold;
                }
            }
        }
    }

    .yesIcon {
        color: ${Colors.brightGreen};
    }

    .noIcon {
        color: ${Colors.red};
    }

    .icons {
        font-size: 24px;
        margin-top: 10px;
    }
`;


const ConfirmStep = () => {

    const dispatch = useDispatch();
    const db = firebase.firestore();
    const stockDevicesRef = db.collection('StockDevices');
    const usersRef = db.collection('Users');
    library.add(faTimes, faCheck);
    const formFieldValues = useSelector(state => state.addDeviceFormValues);
    const currentUserId = useSelector(state => state.currentUserId);
    const userData = useSelector(state => state.userData);
    const deviceBeingEdited = useSelector(state => state.deviceBeingEdited);
    const imageStorageRef = firebase.storage().ref();

    const addToStockDevices = async newDevice => {
        newDevice.general.imageFile = '';
        const newDocumentRef = stockDevicesRef.doc();
        await newDocumentRef.set(newDevice);
        newDevice['deviceId'] = await newDocumentRef.id;
        newDevice['verified'] = false;
        await newDocumentRef.set(newDevice);
        return newDocumentRef.id;
    }

    const addToUserDevices = async (newDevice, deviceId) => {
        const updatedDevices = [...userData.devices, await newDevice];

        updatedDevices['deviceId'] = await deviceId;
        updatedDevices['verified'] = false;

        usersRef.doc(currentUserId).update(
            {
                'devices': updatedDevices
            }).then(() => {
                dispatch(toggleAddDeviceForm(false));
                dispatch(addDeviceFormValues({}));
                dispatch(currentStep(1));
                sweetAlert.fire({
                    title: 'Success',
                    text: 'Device added',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2500,
                    className: ''
                });
            });
    }

    const uploadImage = async imageFile => {
        let imageUpload = imageStorageRef.child('deviceImages').child(imageFile.name)

        await imageUpload.put(imageFile);
    }

    const addDevice = async () => {
        if (formFieldValues.general.imageFile) {
            uploadImage(formFieldValues.general.imageFile);
        }
        addToUserDevices(formFieldValues, addToStockDevices(formFieldValues));
    }

    const CapitalizeString = string => {
        string = string.split(" ");

        for (var i = 0, x = string.length; i < x; i++) {
            string[i] = string[i][0].toUpperCase() + string[i].substr(1);
        }

        return string.join(" ");
    }

    const MidiDetail = props => {
        return (
            <div className='midiDetail'>
                <div className='detailTitle'>{CapitalizeString((props.miditype).replace(/_/g, ' '))}</div>
                {formFieldValues.midi[props.miditype].enabled ?
                    <FontAwesomeIcon className='yesIcon icons' icon="check" /> :
                    <FontAwesomeIcon className='noIcon icons' icon="times" />
                }
            </div>
        )
    }

    MidiDetail.propTypes = {
        miditype: PropTypes.string,
    }

    const AudioDetail = props => {
        return (
            <div className='audio'>
                <div className='audioTitle detailTitle'>{props.audiolabel}</div>
                <div className='audioDetailContainer'>
                    {Object.keys(formFieldValues.audio[props.audiotype]).length > 0 ? Object.keys(formFieldValues.audio[props.audiotype]).map((key, index) => (
                        <div className='audioDetail' key={index}>{key}</div>
                    )) :
                        <div className='audioDetail'>
                            <FontAwesomeIcon className='noIcon icons' icon="times" />
                        </div>
                    }
                </div>
            </div>
        )
    }

    AudioDetail.propTypes = {
        audiotype: PropTypes.string,
        audiolabel: PropTypes.string
    }

    return (
        <Styles>
            {Object.keys(formFieldValues).length > 2 ?
                <>
                    <div className='summaryContainer'>
                        <StepNavigationButton iconname='arrow-circle-left' />
                        <div className='summarySection'>
                            <div className='summarySectionTitle'>General</div>
                            <div className='summaryDetails'>
                                <div className='detailContainer'>
                                    <div className='detailTitle'>
                                        Manufacturer
                                    </div>
                                    <div className='detail'>
                                        {formFieldValues.general.manufacturer}
                                    </div>
                                </div>

                                <div className='detailContainer'>
                                    <div className='detailTitle'>
                                        Device Name
                                    </div>
                                    <div className='detail'>
                                        {formFieldValues.general.deviceName}
                                    </div>
                                </div>

                                <div className='detailContainer'>
                                    <div className='detailTitle'>
                                        Device Type
                                    </div>
                                    {formFieldValues.general.deviceTypes.map((type, index) => (
                                        <div key={index} className='detail'>
                                            {CapitalizeString(type.replace(/_/g, ' '))}
                                        </div>
                                    ))}
                                </div>
                                <div className='imagePreview detailContainer'>
                                    <div className='detailTitle'>
                                        Device Image
                                    </div>
                                    {formFieldValues.general.imageRef ?
                                        <img src={deviceBeingEdited ? formFieldValues.imageUrl : formFieldValues.general.imageRef}></img> :
                                        <div className=''>
                                            <FontAwesomeIcon className='noIcon icons' icon="times" />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='summarySection'>
                            <div className='summarySectionTitle'>Audio</div>
                            <div className='summaryDetails'>
                                <div className='audioSummary'>
                                    <AudioDetail audiotype='audioOut' audiolabel='Audio Out' />
                                    <AudioDetail audiotype='audioIn' audiolabel='Audio In' />
                                </div>
                            </div>
                        </div>
                        <div className='summarySection'>
                            <div className='summarySectionTitle'>Midi</div>
                            <div className='summaryDetails midiContainer'>
                                <div className='midiDetail'>
                                    <MidiDetail miditype='midi_out' />
                                </div>
                                <div className='midiDetail'>
                                    <MidiDetail miditype='midi_in' />
                                </div>
                                <div className='midiDetail'>
                                    <MidiDetail miditype='midi_thru' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <CustomButtonStyles>
                        <button type='submit' onClick={addDevice} className='customButton'>Add device</button>
                    </CustomButtonStyles>
                </> : null
            }
        </Styles>
    )
}

export default ConfirmStep;