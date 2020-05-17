import React from 'react';
import DeviceTray from '../../components/DeviceTray/DeviceTray';
import { useSelector } from 'react-redux';
import Workspace from '../../components/Workspace/Workspace';
import AddDevice from '../../components/AddDevice/AddDevice';
import styled from 'styled-components';


const Styles = styled.div`
    .studioDesignerContainer {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }
`

const StudioDesignerPage = () => {
    const isAddDeviceFormOpen = useSelector(state => state.isAddDeviceFormOpen);

    return (
        <Styles>
            <div className='studioDesignerContainer'>
                {isAddDeviceFormOpen ?
                    <AddDevice /> :
                    <Workspace />
                }
                <DeviceTray />
            </div>
        </Styles>
    )
}

export default StudioDesignerPage;