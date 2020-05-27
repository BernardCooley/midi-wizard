import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import styled from 'styled-components';
import PropTypes from 'prop-types';
import DeleteIcon from '../../icons/delete.svg';
import EditIcon from '../../icons/edit.svg';
import AddToLayoutIcon from '../../icons/add_to_layout.svg';
import { toggleAddDeviceForm, deviceBeingEdited, addDeviceFormValues } from '../../actions';
import Colors from '../../styles/colors';
import sweetAlert from 'sweetalert2';


const Styles = styled.div`
    border-right: 3px outset ${Colors.middleGray};

    .deviceContainer {
        height: 171px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin: 5px 10px;
        padding: 5px;

        .deviceTrayOptions {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            top: 10px;
            z-index: 11;

            .deviceActionContainer {
                opacity: 1;
                display: flex;
                justify-content: space-between;
                width: auto;
                cursor: pointer;
                transition:0.2s;
                -webkit-transition:0.2s;
                -moz-transition:0.2s;

                .actionIcon {
                    height: 15px;
                    pointer-events: none;
                }

                &:hover {
                    transform: scale(1.3);
                }

                .deleteIcon {
                    height: 20px;
                    margin-bottom: 4px;
                }
            }
        }

        .img {
            width: 150px;
            border: 0;
        }

        .alreadyInLayout {
            opacity: 0.5 !important;
            pointer-events: none;
            cursor: default;
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
    const userData = useSelector(state => state.userData);
    const [imageUrl, setImageUrl] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        setInCurrentWorkspace(isDeviceInCurrentLayout());
    }, [layout]);

    useEffect(() => {
        getImageUrl();
    }, [props.device]);

    const getImageUrl = async () => {
        const deviceImageName = props.device.general.imageName ? props.device.general.imageName : 'default_device_image.jpg';

        await firebase.storage().ref().child(`deviceImages/${deviceImageName}`).getDownloadURL().then(response => {
            setImageUrl(response);
        });
    }

    const addToLayout = async (e) => {
        const clickedDeviceId = e.target.getAttribute('deviceid');

        let selectedDevice = userData.devices.filter(device => device.deviceId === clickedDeviceId)[0];

        const currentLayout = userLayouts.filter(layout => layout.layoutId === layoutId)[0];

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
            sweetAlert.fire({
                title: 'Success',
                text: 'Device deleted.',
                icon: 'success',
                showConfirmButton: false,
                timer: 2500,
                className: ''
            });
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

    const editDevice = () => {
        dispatch(toggleAddDeviceForm(true));
        dispatch(deviceBeingEdited(true));
        dispatch(addDeviceFormValues(props.device));
    }

    TrayDevice.propTypes = {
        device: PropTypes.object
    }

    return (
        <Styles>
            <div deviceid={props.device ? props.device.deviceId : ''} className='deviceContainer'>
                <div className='deviceTrayOptions'>
                    <div deviceid={props.device.deviceId} className='deviceActionContainer' onClick={editDevice}>
                        <img src={EditIcon} className='actionIcon'></img>
                    </div>
                    <div deviceid={props.device.deviceId} className={`deviceActionContainer ${inCurrentWorkspace ? 'alreadyInLayout' : ''}`} onClick={addToLayout}>
                        <img src={AddToLayoutIcon} className='actionIcon'></img>
                    </div>
                    <div deviceid={props.device.deviceId} className='deviceActionContainer' onClick={deleteDevice}>
                        <img src={DeleteIcon} className='deleteIcon actionIcon'></img>
                    </div>
                </div>
                <img deviceid={props.device ? props.device.deviceId : ''} className={`img ${inCurrentWorkspace ? 'alreadyInLayout' : ''}`} src={imageUrl} alt=''></img>
                <div className={`deviceTitle ${inCurrentWorkspace ? 'alreadyInLayout' : ''}`}>{props.device ? props.device.deviceName : ''}</div>
            </div>
        </Styles>
    )
}

export default TrayDevice;