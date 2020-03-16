import React, {useEffect, useState} from 'react';
import './AddDevice.scss';
import firebase from '../../firebase';

const AddDevice = (props) => {
    const db = firebase.firestore();
    const userDeviceDataRef = db.collection('UserDeviceData');

    const addDevice = async e => {
        e.preventDefault();

        const newDevice = 
        {
            "deviceName": e.target.name.value,
            "manufacturer": e.target.manufacturer.value,
            "midi": [
                e.target.midiIn.checked, 
                e.target.midiOut.checked, 
                e.target.midiThru.checked
            ]
        }

        let updatedDevices = await getCurrentUserDevices(props.loggedInUserId);
        
        userDeviceDataRef.doc(props.loggedInUserId).set({"devices": [...updatedDevices.devices, newDevice]});
    }

    const getCurrentUserDevices = async userId => {
        const response = await userDeviceDataRef.doc(userId).get();
        return response.data();
    }

    return(
        <div className="addDeviceContainer">
            <form className="addDeviceForm" onSubmit={addDevice}>
                <input type="text" placeholder="Manufacturer" name="manufacturer"></input>
                <input type="text" placeholder="DeviceName" name="name"></input>
                <div className="formField">
                    <input type="checkbox" value="Midi In" name="midiIn" id="midiIn"></input>
                    <label for="midiIn">Midi In</label>
                </div>
                <div className="formField">
                    <input type="checkbox" value="Midi Out" name="midiOut" id="midiOut"></input>
                    <label for="midiOut">Midi Out</label>
                </div>
                <div className="formField">
                    <input type="checkbox" value="Midi Thru" name="midiThru" id="midiThru"></input>
                    <label for="midiThru">Midi Thru</label>
                </div>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default AddDevice;