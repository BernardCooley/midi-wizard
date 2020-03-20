import React, { useEffect } from 'react';
import './Workspace.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getWorkspaceDevices } from '../../actions';
import Device from '../Device/Device';

const Workspace = () => {

    const userDevices = useSelector(state => state.userDevices);
    const workspaceDevice = true;

    return (
        <div className='workSpaceContainer'>
            {userDevices.length > 0 ? userDevices.map((device, index) => (
                device.workspace ? <Device key={index} deviceDetails={device} workspaceDevice={workspaceDevice} />
                    : null
            )) : null}
        </div>
    )
}

export default Workspace;