import React from 'react';
import AdminConsoleDevices from '../../components/AdminConsoleDevices/AdminConsoleDevices';

const AdminConsole = () => {

    const styles = {
        adminConsoleContainer: {
            paddingTop: '50px'
        }
    }

    return (
        <div style={styles.adminConsoleContainer} className='adminConsoleContainer'>
            <AdminConsoleDevices/>
        </div>
    )
}

export default AdminConsole;