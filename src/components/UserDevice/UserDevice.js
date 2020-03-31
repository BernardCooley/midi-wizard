import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import firebase from 'firebase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDevice = (deviceDetails) => {
    library.add(faTrashAlt);
    const db = firebase.firestore();
    const device = deviceDetails.deviceDetails;

    const userDataRef = db.collection('UserDeviceData');
    const userLayoutDataRef = db.collection('UserLayouts');

    const stockDevices = useSelector(state => state.stockDevices);
    const userDeviceIds = useSelector(state => state.userDeviceIds);
    const userId = useSelector(state => state.currentUserId);
    const layoutId = useSelector(state => state.selectedLayoutId);
    const userLayouts = useSelector(state => state.layouts);
    const layout = useSelector(state => state.currentLayout);
    const [inCurrentWorkspace, setInCurrentWorkspace] = useState(false);
    const [clickedDeviceId, setClickedDeviceId] = useState([]);

    useEffect(() => {
        setInCurrentWorkspace(isDeviceInCurrentLayout());
    }, [layout]);

    const notify = message => {
        toast(message);
    };

    const addToLayout = async (clickedDeviceId, position) => {
        const selectedDevice = stockDevices.filter(device => device.deviceId === clickedDeviceId)[0];

        const newLayoutDevice = createNewLayoutDeviceFromStockDevice(selectedDevice, position);

        const currentLayout = userLayouts.filter(layout => layout.layoutId === layoutId)[0];

        if(!isDeviceAlreadyInLayout(currentLayout, newLayoutDevice)) {
            const updatedLayoutDevices = [...currentLayout.devices, newLayoutDevice];

            await userLayoutDataRef.doc(currentLayout.layoutId).set({
                'layoutId': currentLayout.layoutId,
                'layoutName': currentLayout.layoutName,
                'devices': updatedLayoutDevices
            })
        }
    }

    const dragDevice = e => {
        setClickedDeviceId(e.target.getAttribute('deviceid'));
        
    }

    const dropDevice = e => {
        e = e || window.event;
        addToLayout(clickedDeviceId, [e.pageX, e.pageY]);
    }

    const createNewLayoutDeviceFromStockDevice = (stockDevice, position) => {
        return {
            'deviceId': stockDevice.deviceId,
            'midi': setMidiForNewLayoutDevice(stockDevice),
            'audio': setAudioForNewLayoutDevice(stockDevice),
            'deviceName': stockDevice.deviceName,
            'layoutId': layoutId,
            'svg': {'x' : position[0], 'y': position[1]}
        }
    }

    const setMidiForNewLayoutDevice = device => {
        let midi = {};

        if(device.midi.in) {midi['in'] = ''};
        if(device.midi.out) {midi['out'] = ''};
        if(device.midi.thru) {midi['thru'] = ''};

        return midi;
    }

    const setAudioForNewLayoutDevice = device => {
        const ins = {};
        const outs = {};

        for(let i  = 0; i < device.audio.ins; i++) {ins[i+1] = ''}
        for(let i  = 0; i < device.audio.outs; i++) {outs[i+1] = ''}

        return {
            'ins': ins,
            'outs': outs
        }
    }

    const isDeviceAlreadyInLayout = (layout, selectedDevice) => {
        return layout.devices.filter(device => device.deviceId === selectedDevice.deviceId).length > 0;
    }

    const deleteDevice = e => {
        const clickedDeviceId = e.target.parentNode.parentNode.getAttribute('deviceid');

        if(doesDeviceExistInLayouts(clickedDeviceId)) {
            let deviceInLayoutsMessage = 'This device exists in the following layouts:'

            getLayoutsThatContainDevice(clickedDeviceId).forEach(layoutName => {
                deviceInLayoutsMessage = `${deviceInLayoutsMessage}\n${layoutName} `
            });

            deviceInLayoutsMessage = `${deviceInLayoutsMessage}\n\nDelete anyway?`

            if(window.confirm(deviceInLayoutsMessage)) {
                deleteFromDB(clickedDeviceId);
            }
        }else {
            if(window.confirm("Delete from device tray?")) {
                deleteFromDB(clickedDeviceId);
            }
        }
    }

    const deleteFromDB = async deviceIdToDelete => {
        const newUserDeviceList = userDeviceIds.filter(deviceId => deviceId !== deviceIdToDelete);

        await userDataRef.doc(userId).update({
            devices: newUserDeviceList
        }).then(() => {
            removeDeviceFromLayouts(deviceIdToDelete);
        });
    }

    const removeDeviceFromLayouts = async deviceIdToDelete => {
        const filteredDevices = []

        userLayouts.map(layout => {
            const dev = layout.devices.filter(device => device.deviceId === deviceIdToDelete)[0];

            if(dev) {
                filteredDevices.push(dev);
            }
        });

        filteredDevices.forEach(async layoutDevice => {
            const layoutDevices = userLayouts.filter(layout => layout.layoutId === layoutDevice.layoutId)[0];

            const newLayoutDevices = layoutDevices.devices.filter(device => device !== layoutDevice);

            await userLayoutDataRef.doc(layoutDevice.layoutId).update({
                devices: newLayoutDevices
            }).then(() => {
                notify('Device deleted');
            });
        })
    }

    const doesDeviceExistInLayouts = dev => {
        let doesExist = false;
        userLayouts.forEach(layout => {
            if(layout.devices.filter(device => device.deviceId === dev.deviceId).length > 0) {
                doesExist = true;
            }
        })
        return doesExist;
    }

    const isDeviceInCurrentLayout = () => {
        let inCurrentLayout = false;
        if(layout.devices && device) {
            const layoutDeviceIds = layout.devices.map(device => device.deviceId);
            inCurrentLayout = layoutDeviceIds.includes(device.deviceId)
        }
        return inCurrentLayout;
    }

    const getLayoutsThatContainDevice = dev => {
        const matchedLayouts = []

        userLayouts.forEach(layout => {
            layout.devices.forEach(device => {
                if(device.deviceId === dev.deviceId) {
                    matchedLayouts.push(layout.layoutName);
                }
            })
        });
        return matchedLayouts;
    }

    const styles = {
        deviceContainer: {
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '5px 10px',
            padding: '5px'
        },
        deviceTrayOptions: {
            width: '87%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            top: '10px',
            right: '14px',
            zIndex: '11'
        },
        img: {
            width: '150px',
            border: '0'
        },
        svg: {
            pointerEvents: 'none'
        },
        deviceAction: {
            fontSize: '18px'
        },
        deleteIcon: {
            color: 'red'
        },
        deviceTitle: {

        },
        deviceActionContainer: {
            cursor: 'pointer',
            opacity: '1'
        },
        alreadyInLayout: {
            opacity: '0.5'
        }
    }

    return (
        <div deviceid={device ? device.deviceId : ''} style={styles.deviceContainer}>
            <ToastContainer />
            <div style={styles.deviceTrayOptions}>
                <div style={styles.deviceActionContainer} onClick={deleteDevice}>
                    <FontAwesomeIcon className='deleteIcon' style={{...styles.svg, ...styles.deviceAction, ...styles.deleteIcon}} icon="trash-alt" />
                </div>
            </div>
            <img deviceid={device ? device.deviceId : ''} onDragStart={dragDevice} onDragEnd={dropDevice} style={{...styles.img, ...inCurrentWorkspace ? styles.alreadyInLayout : ''}} src={device.imageUrl} alt=''></img>
            <div style={{...styles.deviceTitle, ...inCurrentWorkspace ? styles.alreadyInLayout : ''}}>{device ? device.deviceName : ''}</div>
        </div>
    )
}

export default UserDevice;