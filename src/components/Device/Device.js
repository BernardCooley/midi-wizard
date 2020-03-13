import React, {useState} from 'react';
import './Device.scss';

const Device = (deviceDetails) => {

    const [device] = useState(deviceDetails.deviceDetails);

    return (
        <div className="deviceContainer">
            <h3>{device.name}</h3>
            <div className="midiDetailsContainer">
                <div className="midiDetail">
                    {device.midiDetails.in.available ? (<div className="midiInLabel">In: {device.midiDetails.in.connectedTo}</div>) : null}
                </div>
                <div className="midiDetail">
                    {device.midiDetails.out.available ? (<div className="midiOutLabel">Out: {device.midiDetails.out.connectedTo}</div>) : null}
                </div>
                <div className="midiDetail">
                    {device.midiDetails.thru.available ? (<div className="midiThruLabel">Thru: {device.midiDetails.thru.connectedTo}</div>) : null}
                </div>
            </div>
        </div>
    )
}

export default Device;