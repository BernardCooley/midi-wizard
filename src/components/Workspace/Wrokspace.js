import React from 'react';
import { useSelector } from 'react-redux';
import firebase from 'firebase';
import LayoutsTray from '../LayoutsTray/LayoutsTray';

const Workspace = () => {

    const db = firebase.firestore();
    const userLayoutDataRef = db.collection('UserLayouts');
    const layout = useSelector(state => state.currentLayout);

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