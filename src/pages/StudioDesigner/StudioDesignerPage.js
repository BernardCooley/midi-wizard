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
            backgroundColor: 'lightgreen'
        }
    }

    return(
        <div style={styles.studioDesignerContainer}>
            {isAddDeviceFormOpen ? 
                <AddDevice/> :
                <Workspace/>
            }
            <UserDeviceList/>
        </div>
    )
}

export default StudioDesignerPage;