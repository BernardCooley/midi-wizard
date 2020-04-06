import React from 'react';
import AdminConsoleDevices from '../../components/AdminConsoleDevices/AdminConsoleDevices';
import styled from 'styled-components';


const Styles = styled.div`
    .adminConsoleContainer {
        padding-top: 50px;
    }
`

const AdminConsole = () => {

    const styles = {
        adminConsoleContainer: {
            paddingTop: '50px'
        }
    }

    return (
        <Styles>
            <div className='adminConsoleContainer'>
                <AdminConsoleDevices/>
            </div>
        </Styles>
    )
}

export default AdminConsole;