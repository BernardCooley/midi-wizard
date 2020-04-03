import React from 'react';
import UserDeviceList from '../../components/UserDeviceList/UserDeviceList';
import { useSelector } from 'react-redux';
import Workspace from '../../components/Workspace/Wrokspace';
import AddDevice from '../../components/AddDevice/AddDevice';
import styled from 'styled-components';


const Styles = styled.div`
    .studioDesignerContainer {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        background-color: lightgreen;
    }
`

const StudioDesignerPage = () => {
    const isAddDeviceFormOpen = useSelector(state => state.isAddDeviceFormOpen);

    return(
        <Styles>
            <div className='studioDesignerContainer'>
                {isAddDeviceFormOpen ? 
                    <AddDevice/> :
                    <Workspace/>
                }
                <UserDeviceList/>
            </div>
        </Styles>
    )
}

export default StudioDesignerPage;