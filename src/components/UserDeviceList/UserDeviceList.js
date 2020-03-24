import React from 'react';
import UserDevice from '../UserDevice/UserDevice';
import './UserDeviceList.scss';
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

    return(
        <div className="devicesListContainer">
            {userDevices.length > 0 ? userDevices.map((deviceDetails, index) => (
                <UserDevice key={index} deviceDetails={deviceDetails} workspaceDevice={workspaceDevice}/>
            )):null}
            {!isAddDeviceFormOpen ? 
                <div className={`openAddDeviceFormButton ${ deviceTrayOpen ? 'trayOpen': ''}`} onClick={() => dispatch(toggleAddDeviceForm(true))}><FontAwesomeIcon icon="plus" /></div>
                 : 
                null
            }
        </div>
      );
}

export default UserDeviceList;