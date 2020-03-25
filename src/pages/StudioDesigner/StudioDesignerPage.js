import React from 'react';
import UserDeviceList from '../../components/UserDeviceList/UserDeviceList';
import { useSelector, useDispatch } from 'react-redux';
import Workspace from '../../components/Workspace/Wrokspace';
import AddDevice from '../../components/AddDevice/AddDevice';

const StudioDesignerPage = () => {

    const dispatch = useDispatch();
    const deviceTrayOpen = useSelector(state => state.isDeviceTrayOpen);
    const isAddDeviceFormOpen = useSelector(state => state.isAddDeviceFormOpen);

    const styles = {
        studioDesignerContainer: {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'lightgreen',
            paddingTop: '90px'
        },
        deviceTrayContainer: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }

    return(
        <div style={styles.studioDesignerContainer}>
            {isAddDeviceFormOpen ? 
                <AddDevice/> :
                <Workspace/>
            }
            <div style={styles.deviceTrayContainer} className={deviceTrayOpen ? '': 'deviceContainerClosed'}>
                <UserDeviceList className='deviceListOuterContainer'/>
            </div>
        </div>
    )
}

export default StudioDesignerPage;