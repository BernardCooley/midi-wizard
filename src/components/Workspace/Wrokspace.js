import React, { useEffect } from 'react';
import './Workspace.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getWorkspaceDevices } from '../../actions';
import UserDevice from '../UserDevice/UserDevice';

const Workspace = () => {

    return (
        <div className='workSpaceContainer'>
            Workspace
        </div>
    )
}

export default Workspace;