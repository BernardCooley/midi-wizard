import React, {useState} from 'react';
import './Device.scss';

const Device = (deviceDetails) => {

    const [device] = useState(deviceDetails.deviceDetails);
    const deviceName = Object.keys(device)[0];

    return (
        <div className="deviceContainer">
            <h3>{deviceName}</h3>
            <div className="midiDetailsContainer">
                <div className="midiDetail">
                    <div className="midiInLabel">In: {device[deviceName].midi[0]}</div>
                </div>
                <div className="midiDetail">
                    <div className="midiInLabel">Out: {device[deviceName].midi[1]}</div>
                </div>
                <div className="midiDetail">
                    <div className="midiInLabel">Thru: {device[deviceName].midi[2]}</div>
                </div>
            </div>
        </div>
    )
}

export default Device;