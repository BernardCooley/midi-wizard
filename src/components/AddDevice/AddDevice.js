import React, {useState} from 'react';
import './AddDevice.scss';
import firebase from '../../firebase';
import AutoCompleteList from '../AutoCompleteList/AutoCompleteList';
import { useSelector, useDispatch } from 'react-redux';

const AddDevice = (props) => {
    const db = firebase.firestore();
    const userDeviceDataRef = db.collection('UserDeviceData');
    const allDeviceDataRef = db.collection('DeviceData');

    const dispatch = useDispatch();
    
    const stockDevices = useSelector(state => state.stockDevices);
    const userDevices = useSelector(state => state.userDevices);
    const currentUserId = useSelector(state => state.currentUserId);
    const currentUsername = useSelector(state => state.currentUsername);

    const [addDeviceEnabled, setAddDeviceEnabled] = useState(false);
    const [autoCompleteList, setAutoCompleteList] = useState([]);

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

        doesDeviceExist(stockDevices, deviceName) ? console.log('Already exists in all devices db') : addToAllDevices(newDevice);

        if(!doesDeviceExist(userDevices, deviceName)) {
            userDeviceDataRef.doc(currentUserId).set(
                {"devices": [...userDevices, newDevice],
                username: currentUsername
            });
            toggleAddDeviceForm();
        }else {
            alert('Already added to your studio');
        }
    }

    const doesDeviceExist = (deviceList, newDeviceName) => {
        return deviceList.filter(device => device.deviceName === newDeviceName).length > 0 ? true : false;
    }

    const addToAllDevices = async newDevice => {
        const newDocument = allDeviceDataRef.doc();
        await newDocument.set(newDevice);
    }

    const toggleAddDeviceForm = () => {
        setAddDeviceEnabled(!addDeviceEnabled);
    }

    const searchExistingDevices = async e => {
        const inputValue = e.target.value;
        const fieldName = e.target.name;
        const matchList = [];

        if(e.target.value.length > 2) {
            const matchedDevices = stockDevices.filter(device => device[fieldName].toLowerCase().includes(inputValue.toLowerCase()));

            matchedDevices.map(matchedDevice => {
                matchList.push(matchedDevice[fieldName]);
            });
        }
    }

    return(
        <div className="addDeviceContainer">

            {addDeviceEnabled ? 
            <form className="addDeviceForm" onSubmit={addDevice} autocomplete="off">
                <div className="manufacturer">
                    <input type="text" placeholder="Manufacturer" name="manufacturer" onChange={searchExistingDevices}></input>
                </div>
                
                <input type="text" placeholder="DeviceName" name="deviceName" onChange={searchExistingDevices}></input>
                <div className="formField">
                    <input type="checkbox" value="Midi In" name="midiIn" id="midiIn"></input>
                    <label htmlFor="midiIn">Midi In</label>
                </div>
                <div className="formField">
                    <input type="checkbox" value="Midi Out" name="midiOut" id="midiOut"></input>
                    <label htmlFor="midiOut">Midi Out</label>
                </div>
                <div className="formField">
                    <input type="checkbox" value="Midi Thru" name="midiThru" id="midiThru"></input>
                    <label htmlFor="midiThru">Midi Thru</label>
                </div>
                <button type="submit">Add</button>
                <button onClick={toggleAddDeviceForm}>Cancel</button>
            </form>: 
            <div>
                <button onClick={toggleAddDeviceForm}>Add device</button>
            </div>}
        </div>
    )
}

export default AddDevice;