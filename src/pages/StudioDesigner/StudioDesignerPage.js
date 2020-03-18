import React from 'react';
import './StudioDesignerPage.scss';
import DeviceList from '../../components/DeviceList/DeviceList';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAddDeviceForm } from '../../actions';
import ToggleDeviceTray from '../../components/ToggleDeviceTray/ToggleDeviceTray';
import Workspace from '../../components/Workspace/Wrokspace';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddDevice from '../../components/AddDevice/AddDevice';

const StudioDesignerPage = () => {

    library.add(faPlus);
  
    const dispatch = useDispatch();
    const deviceTrayOpen = useSelector(state => state.isDeviceTrayOpen);
    const isAddDeviceFormOpen = useSelector(state => state.isAddDeviceFormOpen);

    return(
        <div className='studioDesignerContainer'>
            <AddDevice/>
            {!isAddDeviceFormOpen ? 
                <div className={`openAddDeviceFormButton ${ deviceTrayOpen ? 'trayOpen': ''}`} onClick={() => dispatch(toggleAddDeviceForm(true))}><FontAwesomeIcon icon="plus" /></div> : 
                null
            }
            <Workspace/>
            <div className={`deviceTrayContainer ${ deviceTrayOpen ? '': 'deviceContainerClosed'}`}>
                <div className='deviceTrayActions'>
                    <ToggleDeviceTray/>
                </div>
                <DeviceList className='deviceListOuterContainer'/>
            </div>
        </div>
    )
}

export default StudioDesignerPage;