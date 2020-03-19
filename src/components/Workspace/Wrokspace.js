import React from 'react';
import './Workspace.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getWorkspaceDevices } from '../../actions';
import Device from '../Device/Device';

const Workspace = () => {

    const workspaceDevices = useSelector(state => state.workspaceDevices);

    return (
        <div className='workSpaceContainer'>
            {workspaceDevices.length > 0 ? workspaceDevices.map((deviceDetails, index) => (
                <div key={index}>{deviceDetails}</div>
            )):null}
        </div>
    )
}

export default Workspace;