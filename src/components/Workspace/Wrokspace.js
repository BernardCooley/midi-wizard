import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getWorkspaceDevices } from '../../actions';
import UserDevice from '../UserDevice/UserDevice';

const Workspace = () => {


    const styles = {
        workSpaceContainer: {
            backgroundColor: 'lightblue',
            width: '100%',
            height: '100%',
            padding: '20px 0',
            display: 'flex',
            paddingTop: '50px'
        }
    }

    return (
        <div style={styles.workSpaceContainer}>
            Workspace
        </div>
    )
}

export default Workspace;