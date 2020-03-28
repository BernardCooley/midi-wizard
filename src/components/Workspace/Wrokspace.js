import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { currentLayout } from '../../actions';
import firebase from 'firebase';
import LayoutsTray from '../LayoutsTray/LayoutsTray';

const Workspace = () => {

    const db = firebase.firestore();
    const userLayoutDataRef = db.collection('UserLayouts');
    const dispatch = useDispatch();
    const currentLayoutId = useSelector(state => state.selectedLayoutId);
    const userLayouts = useSelector(state => state.layouts);
    const layout = useSelector(state => state.currentLayout);

    useEffect(() => {
        if(userLayouts.length > 0) {
            if(currentLayoutId) {
                dispatch(currentLayout(userLayouts.filter(layout => layout.layoutId === currentLayoutId)[0]));
            }
        }
    }, [userLayouts]);

    useEffect(() => {
        if(userLayouts.length > 0) {
            dispatch(currentLayout(userLayouts.filter(layout => layout.layoutId === currentLayoutId)[0]));
        }
    }, [currentLayoutId]);

    const removeFromLayout = async e => {
        const confirmDelete = window.confirm("Delete from layout");

        if(confirmDelete) {
            const deviceId = e.target.parentNode.getAttribute('deviceid');
    
            const updatedLayoutDevices = layout.devices.filter(device => device.deviceId !== deviceId);

            userLayoutDataRef.doc(layout.layoutId).set({
                'layoutId': layout.layoutId,
                'layoutName': layout.layoutName,
                'devices': updatedLayoutDevices
            });
        }
    }

    const styles = {
        workSpaceContainer: {
            backgroundColor: 'lightblue',
            width: '100%',
            height: '100%',
            padding: '20px 0',
            display: 'flex',
            paddingTop: '50px'
        },
        layoutDevicesList: {
            
        },
        layoutDevice: {
            display: 'flex'
        }
    }

    return (
        <div style={styles.workSpaceContainer}>
            <div>{layout.layoutName}</div>
            <div className='layoutDevicesList'>
                {layout.devices ? layout.devices.map((device, index) => (
                        <div deviceid={device.deviceId} key={index} style={styles.layoutDevice}>
                            <div>{device.deviceName}</div>
                            <button onClick={removeFromLayout} style={styles.deleteButton}>Delete</button>
                        </div>
                    )): null
                }
            </div>

            <LayoutsTray/>
        </div>
    )
}

export default Workspace;