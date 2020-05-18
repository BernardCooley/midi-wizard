import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import firebase from 'firebase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import PropTypes from 'prop-types';


const Styles = styled.div`
    .deviceContainer {
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 5px 10px;
        padding: 5px;

        .deviceTrayOptions {
            width: 87%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            top: 10px;
            right: 14px;
            z-index: 11;

            .deviceActionContainer {
                cursor: pointer;
                opacity: 1;

                .deleteIcon {
                    color: ${Colors.red};
                }
                
                .svg {
                    pointer-events: none;
                }
                
                .deviceAction {
                    font-size: 18px;
                }
            }
        }

        .img {
            width: 150px;
            border: 0;
        }

        .alreadyInLayout {
            opacity: 0.5;
        }

        .deviceTitle {

        }
    }
`

const TrayDevice = props => {

    library.add(faTrashAlt);
    const db = firebase.firestore();
    const usersRef = db.collection('Users');
    const userId = useSelector(state => state.currentUserId);
    const layoutId = useSelector(state => state.selectedLayoutId);
    const userLayouts = useSelector(state => state.layouts);
    const layout = useSelector(state => state.currentLayout);
    const [inCurrentWorkspace, setInCurrentWorkspace] = useState(false);
    const [clickedDeviceId, setClickedDeviceId] = useState([]);
    const userData = useSelector(state => state.userData);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        setInCurrentWorkspace(isDeviceInCurrentLayout());
    }, [layout]);

    useEffect(() => {
        getImageUrl();
    }, [props.device]);

    const notify = message => {
        toast(message);
    };

    const getImageUrl = async () => {
        const deviceImageName = props.device.general.imageName ? props.device.general.imageName : 'default_device_image.jpg';

        await firebase.storage().ref().child(`deviceImages/${deviceImageName}`).getDownloadURL().then(response => {
            setImageUrl(response);
        });
    }

    const addToLayout = async (clickedDeviceId, position) => {
        let selectedDevice = userData.devices.filter(device => device.deviceId === clickedDeviceId)[0];

        const currentLayout = userLayouts.filter(layout => layout.layoutId === layoutId)[0];

        if (!isDeviceAlreadyInLayout(currentLayout, selectedDevice)) {
            selectedDevice.position = { 'x': position[0], 'y': position[1] }
            selectedDevice = { [selectedDevice.deviceId]: selectedDevice };

            const updatedLayoutDevices = { ...currentLayout.devices, ...selectedDevice };
            const updatedLayouts = userLayouts.map(layout => {
                if (layout.layoutId === currentLayout.layoutId) {
                    layout.devices = updatedLayoutDevices
                }
                return layout;
            });

            await usersRef.doc(userId).update({
                layouts: updatedLayouts
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

    const isDeviceAlreadyInLayout = (layout, selectedDevice) => {
        const devices = Object.keys(layout.devices);
        return devices.filter(key => layout.devices[key].deviceId === selectedDevice.deviceId).length > 0;
    }

    const deleteDevice = e => {
        const clickedDeviceId = e.target.getAttribute('deviceid');

        if (doesDeviceExistInLayouts(clickedDeviceId)) {
            let deviceInLayoutsMessage = 'This device exists in the following layouts:'

            getLayoutsThatContainDevice(clickedDeviceId).forEach(layout => {
                deviceInLayoutsMessage = `${deviceInLayoutsMessage}\n${layout[0]} `
            });

            deviceInLayoutsMessage = `${deviceInLayoutsMessage}\n\nDelete anyway?`

            if (window.confirm(deviceInLayoutsMessage)) {
                deleteFromDB(clickedDeviceId);
            }
        } else {
            if (window.confirm("Delete from device tray?")) {
                deleteFromDB(clickedDeviceId);
            }
        }
    }

    const deleteFromDB = async (deviceIdToDelete) => {
        const updatedDeviceList = userData.devices.filter(device => device.deviceId !== deviceIdToDelete);

        await usersRef.doc(userId).update({
            devices: updatedDeviceList
        }).then(() => {
            removeDeviceFromLayouts(deviceIdToDelete);
        });
    }

    const removeDeviceFromLayouts = async (deviceIdToDelete) => {

        const updatedLayouts = userLayouts.map(layout => {
            const keptDeviceIds = Object.keys(layout.devices).filter(key => key !== deviceIdToDelete);

            const keptDevices = {};

            keptDeviceIds.forEach(id => {
                keptDevices[id] = layout.devices[id];
            });

            layout.devices = keptDevices;

            return layout;
        });

        await usersRef.doc(userId).update({
            layouts: updatedLayouts
        }).then(() => {
            notify('Device deleted');
        });
    }

    const doesDeviceExistInLayouts = clickedDeviceId => {
        let doesExist = false;

        userLayouts.forEach(layout => {
            doesExist = Object.keys(layout.devices).filter(key => key === clickedDeviceId).length > 0;
            if (doesExist) {
                return;
            }
        })
        return doesExist;
    }

    const isDeviceInCurrentLayout = () => {
        if (layout.devices && Object.keys(layout.devices).length > 0 && props.device) {
            return Object.keys(layout.devices).filter(key => layout.devices[key].deviceId === props.device.deviceId).length > 0;
        }
    }

    const getLayoutsThatContainDevice = deviceId => {
        const matchedLayouts = []

        userLayouts.forEach(layout => {
            Object.keys(layout.devices).forEach(key => {
                if (key === deviceId) {
                    matchedLayouts.push([layout.layoutName, layout.layoutId]);
                }
            });
        });
        return matchedLayouts;
    }

    TrayDevice.propTypes = {
        device: PropTypes.object
    }

    return (
        <Styles>
            <div deviceid={props.device ? props.device.deviceId : ''} className='deviceContainer'>
                <ToastContainer />
                <div className='deviceTrayOptions'>
                    <div deviceid={props.device.deviceId} className='deviceActionContainer' onClick={deleteDevice}>
                        <FontAwesomeIcon className='deleteIcon svg deviceAction' icon="trash-alt" />
                    </div>
                </div>
                <img deviceid={props.device ? props.device.deviceId : ''} onDragStart={dragDevice} onDragEnd={dropDevice} className={`img ${inCurrentWorkspace ? 'alreadyInLayout' : ''}`} src={imageUrl} alt=''></img>
                <div className={`deviceTitle ${inCurrentWorkspace ? 'alreadyInLayout' : ''}`}>{props.device ? props.device.deviceName : ''}</div>
            </div>
        </Styles>
    )
}

export default TrayDevice;