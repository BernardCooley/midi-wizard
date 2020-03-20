import React from 'react';
import Device from '../Device/Device';
import './DeviceList.scss';
import { useSelector } from 'react-redux';

const DeviceList = () => {
    const userDevices = useSelector(state => state.userDevices);
    const workspaceDevice = false;

    return(
        <div className="devicesListContainer">
            {userDevices.length > 0 ? userDevices.map((deviceDetails, index) => (
                <Device key={index} deviceDetails={deviceDetails} workspaceDevice={workspaceDevice}/>
            )):null}
        </div>
      );
}

export default DeviceList;