import React, {useEffect, useState} from 'react';
import './AddDevice.scss';
import firebase from '../../firebase';

const AddDevice = () => {
    const db = firebase.firestore();
    const userDeviceDataRef = db.collection('UserDeviceData');
    const [userDeviceData, setUserDeviceData] = useState([]);
    // const [newDevice, setnewDevice] = useState([]);

    useEffect(() => {
        currentDevices('user1');
    }, []);

    const add = (e) => {
        // TODO doc needs to equal the user id. 'Add user' in Auth.js to be finished first
        e.preventDefault();

        const newDevice = 
        {
            "deviceName": e.target.name.value,
            "manufacturer": e.target.manufacturer.value,
            "midi": [e.target.midiIn.checked, e.target.midiOut.checked, e.target.midiThru.checked]
        }

        userDeviceDataRef.doc()

        console.log([...userDeviceData[0].devices, newDevice])

        // console.log(newDevice);
    }

    let currentDevices = async (userId) => {
        let data = await userDeviceDataRef.get();
        setUserDeviceData(data.docs.map(doc => doc.data()).filter(user => user.userID === userId));
    }

    // userDeviceDataRef.doc('devices').set({

    // });

    return(
        <div className="addDeviceContainer">
            <form className="addDeviceForm" onSubmit={add}>
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