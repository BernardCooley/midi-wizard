import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";


const Styles = styled.div`
    .deviceContainer {
        width: 100px;
        height: 100px;
        background-color: red;
        margin: 30px;

        .deviceOptions {
            position: relative;
            z-index: 35;
            cursor: pointer;
        }
    }
`;

const LayoutDevice = props => {
    library.add(faTimesCircle);

    console.log(props.device)
    const [deviceClickedId, setDeviceClickedId] = useState('');
    const [midiAudioClicked, setMidiAudioClicked] = useState('');
    const [audioInsOutsClicked, setAudioInsOutsClicked] = useState('');
    const [sourceConnection, setSourceConnection] = useState({});

    const showOptions = e => {
        setDeviceClickedId(e.target.getAttribute('deviceid'));
    }

    const showMidi = () => {
        setMidiAudioClicked('midi');
    }

    const showAudio = () => {
        setMidiAudioClicked('audio');
    }

    const showAudioIns = () => {
        setAudioInsOutsClicked('ins');
    }

    const showAudioOuts = () => {
        setAudioInsOutsClicked('outs');
    }

    const setSource = e => {
        setSourceConnection({
            deviceId: e.target.getAttribute('deviceid'),
            inOut: e.target.getAttribute('inout'),
            connectionNumber: e.target.getAttribute('inoutnumber')
        });
    }

    return (
        <Styles>
            <div className='deviceContainer'>
                <FontAwesomeIcon onClick={showOptions} className='optionsIcon' icon="times-circle" deviceid={props.device.deviceId} />
                <div className='deviceName'>
                    {props.device.deviceName}
                </div>
                {deviceClickedId === props.device.deviceId ?

                    <div className='deviceOptions'>
                        {props.device.midi ?
                            <button onClick={showMidi}>Midi</button> : null
                        }
                        {props.device.audio ?
                            <button onClick={showAudio}>Audio</button> : null
                        }
                        {midiAudioClicked === 'midi' ?
                            <div>
                                {props.device.midi.in ?
                                    <button>In</button> : null
                                }
                                {props.device.midi.out ?
                                    <button>Out</button> : null
                                }
                                {props.device.midi.thru ?
                                    <button>Thru</button> : null
                                }
                            </div> : null
                        }
                        {midiAudioClicked === 'audio' ?
                            <div>
                                {props.device.audio.ins ?
                                    <button onClick={showAudioIns}>
                                        Ins
                                        {audioInsOutsClicked === 'ins' ?
                                            <div>
                                                {Object.keys(props.device.audio.ins).map((ins, index) => (
                                                    <button onClick={setSource} inout='in' inoutnumber={ins} deviceid={props.device.deviceId} key={index}>{ins}</button>
                                                ))}
                                            </div> : null
                                        }
                                    </button>
                                    : null
                                }
                                {props.device.audio.outs ?
                                    <button onClick={showAudioOuts}>
                                        Outs
                                        {audioInsOutsClicked === 'outs' ?
                                            <div>
                                                {Object.keys(props.device.audio.outs).map((outs, index) => (
                                                    <button onClick={setSource} inout='out' inoutnumber={outs} deviceid={props.device.deviceId} key={index}>{outs}</button>
                                                ))}
                                            </div> : null
                                        }
                                    </button>
                                    : null
                                }
                            </div> : null
                        }
                    </div> : null
                }
            </div>
        </Styles>
    )
}

LayoutDevice.propTypes = {
    device: PropTypes.array
}

export default LayoutDevice;