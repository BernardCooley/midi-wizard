import React from 'react';
import UserDevice from '../UserDevice/UserDevice';
import './UserDeviceList.scss';
import { useSelector } from 'react-redux';

const UserDeviceList = () => {

    const userDevices = useSelector(state => state.userDevices);
    const workspaceDevice = false;

    return(
        <div className="devicesListContainer">
            {userDevices.length > 0 ? userDevices.map((deviceDetails, index) => (
                <UserDevice key={index} deviceDetails={deviceDetails} workspaceDevice={workspaceDevice}/>
            )):null}
        </div>
      );
}

export default UserDeviceList;