import React from 'react';
import './Device.scss';
import { useSelector } from 'react-redux'

const Device = deviceDetails => {
    const device = deviceDetails.deviceDetails;
    const stockDevices = useSelector(state => state.stockDevices);
    const matchedStockDevice = stockDevices.filter(stockDevice => stockDevice.deviceId === device.deviceId)[0];

    return (
        <div className="deviceContainer">
            <h3>{matchedStockDevice.deviceName}</h3>
            <div className="midiDetailsContainer">
                <div className="midiDetail">
                    {matchedStockDevice.midi.in ? <div className="midiInLabel">In: {device.midi.in.toString()}</div> : null}
                </div>
                <div className="midiDetail">
                    {matchedStockDevice.midi.out ? <div className="midiInLabel">Out: {device.midi.out.toString()}</div> : null}
                </div>
                <div className="midiDetail">
                    {matchedStockDevice.midi.thru ? <div className="midiInLabel">Thru: {device.midi.thru.toString()}</div> : null}
                </div>
            </div>
        </div>
    )
}

export default Device;