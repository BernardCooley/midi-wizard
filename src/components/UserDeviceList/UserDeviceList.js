import React from 'react';
import UserDevice from '../UserDevice/UserDevice';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toggleAddDeviceForm } from '../../actions';

const UserDeviceList = () => {

    library.add(faPlus);
    const dispatch = useDispatch();
    const userDevices = useSelector(state => state.userDevices);
    const isAddDeviceFormOpen = useSelector(state => state.isAddDeviceFormOpen);
    const deviceTrayOpen = useSelector(state => state.isDeviceTrayOpen);
    const workspaceDevice = false;

    const styles = {
        devicesListContainer: {
            display: 'flex',
            flexWrap: 'nowrap',
            marginBottom: '10px',
            justifyContent: 'center',
            alignItems: 'center',
            overflowX: 'auto',
            width: '100%',
            borderTop: '3px solid gray'
        },
        openAddDeviceFormButton: {
            position: 'relative',
            bottom: '-60px',
            right: '-375px',
            backgroundColor: 'gray',
            borderRadius: '25px',
            padding: '10px'
        },
        svg: {
            fontSize: '25px'
          }
    }

    return(
        <div style={styles.devicesListContainer}>
            {userDevices.length > 0 ? userDevices.map((deviceDetails, index) => (
                <UserDevice key={index} deviceDetails={deviceDetails} workspaceDevice={workspaceDevice}/>
            )):null}
            {!isAddDeviceFormOpen ? 
                <div style={styles.openAddDeviceFormButton} className={deviceTrayOpen ? 'trayOpen': ''} onClick={() => dispatch(toggleAddDeviceForm(true))}><FontAwesomeIcon style={styles.svg} icon="plus" /></div>
                 : 
                null
            }
        </div>
      );
}

export default UserDeviceList;