import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import firebase from '../../firebase';
import { CustomButton, ConnectionFormSection } from '../../styles/components';
import { selectedLayoutDeviceId } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Colors from '../../styles/colors';

const Styles = styled.div`
    .midiSelect {
        width: 300px;
        height: 30px;
    }
`;


const DeviceDropdown = props => {

    const [availableMidiDevices, setAvailableMidiDevices] = useState({ in: [], out: [], thru: [] });
    const [currentDevice, setCurrentDevice] = useState({});
    const layout = useSelector(state => state.currentLayout);

    useEffect(() => {
        getAvailableDevices();
        getCurrentDevice();
    }, [layout]);

    const getAvailableDevices = () => {
        const availableIn = layout.devices.filter(device =>
            (device.midi.out || device.midi.out === '' || device.midi.thru || device.midi.thru === '') &&
            device.deviceId !== props.deviceid
        );
        const availableOut = layout.devices.filter(device =>
            (device.midi.in || device.midi.in === '') &&
            device.deviceId !== props.deviceid
        );
        const availableThru = layout.devices.filter(device =>
            (device.midi.in || device.midi.in === '') &&
            device.deviceId !== props.deviceid
        );

        setAvailableMidiDevices({
            in: availableIn,
            out: availableOut,
            thru: availableThru
        });
    }

    const getCurrentDevice = () => {
        setCurrentDevice(layout.devices.filter(device => device.deviceId === props.deviceid)[0]);
    }

    return (
        <Styles>
            {availableMidiDevices[props.midiType].length > 0 ?
                <select id={`midi${props.midiType}Dropdown`} className='midiSelect'>
                    <option value=''>None</option>
                    {availableMidiDevices[props.midiType].map((device, index) => (
                        <option key={index} selected={device.deviceName === currentDevice.midi[props.midiType] ? 'selected' : ''} value={device.deviceName}>{device.deviceName}</option>
                    ))}
                </select> : null
            }
        </Styles>
    )
}

DeviceDropdown.propTypes = {
    deviceid: PropTypes.string,
    midiType: PropTypes.string
}

export default DeviceDropdown;