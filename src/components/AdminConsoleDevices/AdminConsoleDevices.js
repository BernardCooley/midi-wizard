import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase';
import DataTable from 'react-data-table-component';

const AdminConsoleDevices = () => {

    // TODO fix input field so it can be edited correctly
    // change imageUrl to append current access token
    // remove imageName from stock devices
    // adjust code to get imageUrl instead of looking for image with image name
    // fields resetting when a different one is clicked

    const columns = [
        {
            name: 'Device id',
            selector: 'deviceId',
            cell: data => <div>{data.deviceId}</div>,
            sortable: true
        },
        {
            name: 'Manufacturer',
            selector: 'manufacturer',
            cell: data => 
                <div deviceid={data.deviceId} style={styles.inputFieldContainer} className='inputFieldContainer'>
                    <input onBlur={clickAway()} onClick={focusField} onChange={updateFieldValue} fieldName='manufacturer' value={editDeviceId === data.deviceId && editField === 'manufacturer' ? editedFieldValue : data.manufacturer} style={styles.inputField}/>
                </div>,
            sortable: true
        },
        {
            name: 'Device name',
            selector: 'deviceName',
            cell: data => 
                <div deviceid={data.deviceId} style={styles.inputFieldContainer} className='inputFieldContainer'>
                    <input onClick={focusField} onChange={updateFieldValue} fieldName='deviceName' value={editDeviceId === data.deviceId && editField === 'deviceName' ? editedFieldValue : data.deviceName} style={styles.inputField}/>
                </div>,
            sortable: true
        },
        {
            name: 'Audio outs',
            selector: 'audioOuts',
            cell: data => 
                <div deviceid={data.deviceId} style={styles.inputFieldContainer} className='inputFieldContainer'>
                    <input onClick={focusField} onChange={updateFieldValue} fieldName='audioOuts' value={editDeviceId === data.deviceId && editField === 'audioOuts' ? editedFieldValue : data.audioOuts} style={styles.inputField}/>
                </div>,
            sortable: true
        },
        {
            name: 'Audio ins',
            selector: 'audioIns',
            cell: data => 
                <div deviceid={data.deviceId} style={styles.inputFieldContainer} className='inputFieldContainer'>
                    <input onClick={focusField} onChange={updateFieldValue} fieldName='audioIns' value={editDeviceId === data.deviceId && editField === 'audioIns' ? editedFieldValue : data.audioIns} style={styles.inputField}/>
                </div>,
            sortable: true
        },
        {
            name: 'Midi out',
            selector: 'midiOut',
            cell: data => 
                <div deviceid={data.deviceId} style={styles.inputFieldContainer} className='inputFieldContainer'>
                    <input onClick={toggleCheckbox} type='checkbox' fieldName='midiOut' checked={editDeviceId === data.deviceId && editField === 'midiOut' ? isCheckbocChecked : data.midiOut}/>
                </div>,
            sortable: true
        },
        {
            name: 'Midi in',
            selector: 'midiIn',
            cell: data => 
                <div deviceid={data.deviceId} style={styles.inputFieldContainer} className='inputFieldContainer'>
                    <input onClick={toggleCheckbox} type='checkbox' fieldName='midiIn' checked={editDeviceId === data.deviceId && editField === 'midiIn' ? isCheckbocChecked : data.midiIn}/>
                </div>,
            sortable: true
        },
        {
            name: 'Midi thru',
            selector: 'midiThru',
            cell: data => 
                <div deviceid={data.deviceId} style={styles.inputFieldContainer} className='inputFieldContainer'>
                    <input onClick={toggleCheckbox} type='checkbox' fieldName='midiThru' checked={editDeviceId === data.deviceId && editField === 'midiThru' ? isCheckbocChecked : data.midiThru}/>
                </div>,
            sortable: true
        },
        {
            name: 'Image',
            selector: 'image',
            sortable: true,
            cell: data => <img src={data.image} style={styles.img} />
        },
        {
            name: 'Verify',
            selector: 'verify',
            cell: data => <button onClick={verifyDevice} deviceid={data.deviceId}>Verify</button>
        }
      ];

      const db = firebase.firestore();
      const stockDeviceDtaRef = db.collection('DeviceData');
    const dispatch = useDispatch();
    const stockDevices = useSelector(state => state.stockDevices);
    const [data, setData] = useState([]);
    const [editDeviceId, setEditDeviceId] = useState('');
    const [editField, setEditField] = useState('');
    const [editedFieldValue, setEditedFieldValue] = useState('');
    const [editedCheckboxValue, setEditedCheckboxValue] = useState(false);
    const [isCheckbocChecked, setIsCheckbocChecked] = useState(false);

    useEffect(() => {
        setGridData();
    }, [stockDevices]);

    const clickAway = () => {
        console.log(editedFieldValue);
        console.log('--------');
    }

    const focusField = e => {
        setEditedFieldValue(e.target.value);
        setEditDeviceId(e.target.parentNode.getAttribute('deviceid'));
        setEditField(e.target.getAttribute('fieldName'));
    }

    const toggleCheckbox = e => {
        setEditDeviceId(e.target.parentNode.getAttribute('deviceid'));
        setEditField(e.target.getAttribute('fieldName'));

        if(!isCheckbocChecked) {
            setIsCheckbocChecked(true);
        }else {
            setIsCheckbocChecked(false);
        }
    }

    var toNodeList = function(element){
        var fragment = document.createDocumentFragment();
        fragment.appendChild(element.cloneNode());
        return fragment.childNodes;
      };

    const updateFieldValue = e => {
        setEditedFieldValue(e.target.value);
    }

    const setGridData = () => {
        const dataArray = [];
        stockDevices.forEach(device => {
            const deviceData = {};

            if(!device.verified) {
                deviceData['deviceId'] = device.deviceId;
                deviceData['manufacturer'] = device.manufacturer;
                deviceData['deviceName'] = device.deviceName;
                deviceData['audioOuts'] = device.audio.outs;
                deviceData['audioIns'] = device.audio.ins;
                deviceData['midiOut'] = device.midi.out.toString();
                deviceData['midiIn'] = device.midi.in.toString();
                deviceData['midiThru'] = device.midi.thru.toString();
                deviceData['image'] = device.imageUrl
                dataArray.push(deviceData);
            }
        });
        setData(dataArray);
    }

    const verifyDevice = e => {
        const updatedFieldValues = {};
        const deviceId = e.target.getAttribute('deviceid');

        const deviceFields = document.querySelectorAll(`[deviceid='${deviceId}']`);

        deviceFields.forEach(field => {
            if(field.querySelector('input')) {
                const fieldName = field.querySelector('input').getAttribute('fieldname');
                const fieldValue = field.querySelector('input').value;

                updatedFieldValues[fieldName] = fieldValue;
            }
        });

        updateStockDevice(updatedFieldValues, deviceId);
    }

    const updateStockDevice = async (fieldValues, deviceId) => {
        const updatedStockDevice = stockDevices.filter(device => device.deviceId === deviceId)[0];

        updatedStockDevice.deviceName = fieldValues.deviceName;
        updatedStockDevice.manufacturer = fieldValues.manufacturer;
        updatedStockDevice.audio.ins = fieldValues.audioIns;
        updatedStockDevice.audio.outs = fieldValues.audioOuts;
        updatedStockDevice.midi.out = fieldValues.midiOut;
        updatedStockDevice.midi.in = fieldValues.midiIn;
        updatedStockDevice.midi.thru = fieldValues.midiThru;
        updatedStockDevice.verified = true;


        await stockDeviceDtaRef.doc(deviceId).update({
            'deviceName': updatedStockDevice.deviceName,
            'manufacturer': updatedStockDevice.manufacturer,
            'audio': updatedStockDevice.audio,
            'midi': updatedStockDevice.midi,
            'verified': true
        });
    }

    const styles = {
        img: {
            width: '150px'
        },
        inputFieldContainer: {
            
        },
        inputField: {
            border: 'none',
            fontSize: '14px',
            width: 'auto'
        },
        customStyles: {
            rows: {
                style: {
                    minHeight: '72px',
                    height: 'auto'
                }
            },
            headCells: {
                style: {
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    maxWidth: '70px !important'
                },
            },
            cells: {
                style: {
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    maxWidth: '70px !important',
                    padding: '10px 0'
                },
            },
        }
    }

    return (
        <div className='adminConsoleDeivcesContainer'>
            <DataTable title="Stock devices" columns={columns} height='100px' width='100px' data={data} customStyles={styles.customStyles}/>
        </div>
    )
}

export default AdminConsoleDevices;