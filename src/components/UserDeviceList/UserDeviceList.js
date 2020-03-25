import React, { useEffect } from 'react';
import UserDevice from '../UserDevice/UserDevice';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toggleAddDeviceForm, isDeviceTrayOpen } from '../../actions';

const UserDeviceList = () => {

    library.add(faPlus);
    const dispatch = useDispatch();
    const userDevices = useSelector(state => state.userDevices);
    const isAddDeviceFormOpen = useSelector(state => state.isAddDeviceFormOpen);
    const deviceTrayOpen = useSelector(state => state.isDeviceTrayOpen);
    const workspaceDevice = false;

    const toggleDevideTray = () => {
        dispatch(isDeviceTrayOpen());
    }

    const styles = {
        devicesListContainer: {
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            backgroundColor: 'white',
            position: 'absolute',
            bottom: '0',
            flexDirection: 'column'
        },
        openAddDeviceFormButton: {
            backgroundColor: 'gray',
            borderRadius: '25px',
            padding: '10px',
            height: '25px',
            marginLeft: '50px'
        },
        svg: {
            fontSize: '25px'
        },
        listContainer: {
            display: 'flex',
            alignItems: 'center'
        },
        openCloseButton: {
            position: 'relative',
            top: '-29px',
            backgroundColor: 'white',
            height: '30px',
            border: 'none',
            width: '120px',
            fontSize: '20px',
            outline: 'none',
            borderRadius: '5px 5px 0 0',
            cursor: 'pointer'
        },
        hidden: {
            display: 'none'
        }
    }

    return(
        <div style={styles.devicesListContainer}>
            <button onClick={toggleDevideTray} style={styles.openCloseButton}>{deviceTrayOpen ? 'Device tray' : 'Close'}</button>
            <div style={{...styles.listContainer, ...deviceTrayOpen ? styles.hidden : ''}}>
                {userDevices.length > 0 ? userDevices.map((deviceDetails, index) => (
                    <UserDevice key={index} deviceDetails={deviceDetails} workspaceDevice={workspaceDevice}/>
                )):null}
                {!isAddDeviceFormOpen ? 
                    <div style={styles.openAddDeviceFormButton} className={deviceTrayOpen ? 'trayOpen': ''} onClick={() => dispatch(toggleAddDeviceForm(true))}><FontAwesomeIcon style={styles.svg} icon="plus" /></div>
                    : 
                    null
                }
            </div>
        </div>
      );
}

export default UserDeviceList;