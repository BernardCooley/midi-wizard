import React from 'react';
import './StudioDesignerPage.scss';
import UserDeviceList from '../../components/UserDeviceList/UserDeviceList';
import { useSelector, useDispatch } from 'react-redux';
import ToggleDeviceTray from '../../components/ToggleDeviceTray/ToggleDeviceTray';
import Workspace from '../../components/Workspace/Wrokspace';
import AddDevice from '../../components/AddDevice/AddDevice';

const StudioDesignerPage = () => {

    const dispatch = useDispatch();
    const deviceTrayOpen = useSelector(state => state.isDeviceTrayOpen);
    const isAddDeviceFormOpen = useSelector(state => state.isAddDeviceFormOpen);

    return(
        <div className='studioDesignerContainer'>
            {isAddDeviceFormOpen ? 
                <AddDevice/> :
                <Workspace/>
            }
            <div className={`deviceTrayContainer ${ deviceTrayOpen ? '': 'deviceContainerClosed'}`}>
                <div className='deviceTrayActions'>
                    <ToggleDeviceTray/>
                </div>
                <UserDeviceList className='deviceListOuterContainer'/>
            </div>
        </div>
    )
}

export default StudioDesignerPage;