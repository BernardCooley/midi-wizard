import React from 'react';
import AdminConsoleDevices from '../../components/AdminConsoleDevices/AdminConsoleDevices';
import styled from 'styled-components';


const Styles = styled.div`
    .adminConsoleContainer {
        padding-top: 50px;
        height: 100%;
    }
`

const AdminConsole = () => {

    return (
        <Styles>
            <div className='adminConsoleContainer'>
                <AdminConsoleDevices />
            </div>
        </Styles>
    )
}

export default AdminConsole;