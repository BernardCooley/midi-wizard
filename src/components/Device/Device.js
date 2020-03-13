import React, {useState} from 'react';
import './Device.scss';

const Device = (deviceDetails) => {
    const [device] = useState(deviceDetails.deviceDetails);

    return (
        <div className="deviceContainer">
            <h3>{device.deviceName}</h3>
            <div className="midiDetailsContainer">
                <div className="midiDetail">
                    <div className="midiInLabel">In: {device.midi[0]}</div>
                </div>
                <div className="midiDetail">
                    <div className="midiInLabel">Out: {device.midi[1]}</div>
                </div>
                <div className="midiDetail">
                    <div className="midiInLabel">Thru: {device.midi[2]}</div>
                </div>
            </div>
        </div>
    )
}

export default Device;