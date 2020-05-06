import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { CustomButtonStyles } from '../../styles/components';
import Colors from '../../styles/colors';
import StepNavigationButton from './StepNavigationButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';

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
        padding-top: 100px;
        
        .summarySection {
            height: 100%;
            width: 30%;
            margin: 10px;
            display: flex;
            justify-content: center;
            -webkit-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
            -moz-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
            box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
            flex-direction: column;
            align-items: center;

            .midiContainer {
                display: flex;
                justify-content: space-between;

                .midiDetail {
                    text-align: center;

                    .midiIcons {
                        font-size: 24px;
                        margin-top: 10px;
                    }

                    .noIcon {
                        color: ${Colors.red};
                    }

                    .yesIcon {
                        color: ${Colors.brightGreen};
                    }
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
                height: 100%;

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
`;


const ConfirmStep = () => {

    library.add(faTimes, faCheck);
    const formFieldValues = useSelector(state => state.addDeviceFormValues);

    const data = {
        "general": {
            "deviceName": "lhvlj",
            "manufacturer": "bjlbjh",
            "deviceTypes": [
                "audio_interface", "synthesizer"
            ]
        },
        "audio": {
            "audioOut": [
                "fszdf", "thsry"
            ],
            "audioIn": [
                "fbdng", "f\\b\\dng"
            ]
        },
        "midi": {
            "midi_out": true,
            "midi_in": true,
            "midi_thru": false
        },
        "image": "blob:http://localhost:3000/cb7d3dd0-845b-4281-a4fd-45a310472ce4"
    }

    const addDevice = async () => {
        console.log(formFieldValues);
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
                {formFieldValues.midi[props.miditype] ?
                    <FontAwesomeIcon className='yesIcon midiIcons' icon="check" /> :
                    <FontAwesomeIcon className='noIcon midiIcons' icon="times" />
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
                    {formFieldValues.audio[props.audiotype] ? formFieldValues.audio[props.audiotype].map((audio, index) => (
                        <div className='audioDetail' key={index}>{audio}</div>
                    )) : null}
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
                                        Device Name
                                    </div>
                                    <div className='detail'>
                                        {formFieldValues.general.deviceName}
                                    </div>
                                </div>
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
                                        Device Types
                                    </div>
                                    {formFieldValues.general.deviceTypes.map((type, index) => (
                                        <div key={index} className='detail'>
                                            {CapitalizeString(type.replace(/_/g, ' '))}
                                        </div>
                                    ))}
                                </div>
                                <div className='imagePreview'>
                                    <img src={formFieldValues.general.imageRef}></img>
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