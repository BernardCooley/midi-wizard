import React, {useEffect, useState} from 'react';
import './AddDevice.scss';
import firebase from '../../firebase';

const AddDevice = (props) => {
    const db = firebase.firestore();
    const userDeviceDataRef = db.collection('UserDeviceData');
    const allDeviceDataRef = db.collection('DeviceData');
    const [allDeviceData, setAllDeviceData] = useState([]);
    const [userDeviceData, setUserDeviceData] = useState([]);
    const [addDeviceEnabled, setAddDeviceEnabled] = useState(false);

    useEffect(() => {
        getAllDeviceData();
        getUserDeviceData();
    }, []);

    const addDevice = async e => {
        e.preventDefault();
        const deviceName = e.target.deviceName.value;
        const manufacturer = e.target.manufacturer.value;

        const newDevice = 
        {
            "deviceName": deviceName,
            "manufacturer": manufacturer,
            "midi": [
                e.target.midiIn.checked, 
                e.target.midiOut.checked, 
                e.target.midiThru.checked
            ]
        }

        let updatedDevices = await getCurrentUserDevices(props.loggedInUserId);

        doesDeviceExist(allDeviceData, deviceName) ? console.log('Already exists in all devices db') : addToAllDevices(newDevice);

        if(!doesDeviceExist(userDeviceData[0], deviceName)) {
            userDeviceDataRef.doc(props.loggedInUserId).set({"devices": [...updatedDevices.devices, newDevice]});
            getUserDeviceData();
            toggleAddDeviceForm();
        }else {
            alert('Already added to your studio');
        }
    }

    const getCurrentUserDevices = async userId => {
        const response = await userDeviceDataRef.doc(userId).get();
        return response.data();
    }

    const getAllDeviceData = async () => {
        const response = await allDeviceDataRef.get();
        const allDeviceData = await response.docs.map(doc => doc.data());
        setAllDeviceData(allDeviceData);
    }

    const doesDeviceExist = (deviceList, newDeviceName) => {
        return deviceList.filter(device => device.deviceName == newDeviceName).length > 0 ? true : false;
    }

    const getUserDeviceData = async () => {
        const response = await userDeviceDataRef.get();
        const userDeviceData = await response.docs.map(doc => doc.data().devices);
        setUserDeviceData(userDeviceData);
    }

    const addToAllDevices = async newDevice => {
        const newDocument = allDeviceDataRef.doc();
        await newDocument.set(newDevice);
        getAllDeviceData();
    }

    const toggleAddDeviceForm = () => {
        setAddDeviceEnabled(!addDeviceEnabled);
    }

    return(
        <div className="addDeviceContainer">

            {addDeviceEnabled ? 
            <form className="addDeviceForm" onSubmit={addDevice}>
                <input type="text" placeholder="Manufacturer" name="manufacturer"></input>
                <input type="text" placeholder="DeviceName" name="deviceName"></input>
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
            </form> : 
            <div>
                <button onClick={toggleAddDeviceForm}>Add device</button>
            </div>}
        </div>
    )
}

export default AddDevice;