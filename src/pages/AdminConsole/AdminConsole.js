import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleAdminConsole } from '../../actions';
import AdminConsoleDevices from '../../components/AdminConsoleDevices/AdminConsoleDevices';

const AdminConsole = () => {

    const dispatch = useDispatch();

    const closeAdminConsole = () => {
        dispatch(toggleAdminConsole(false));
    }

    const styles = {
        adminConsoleContainer: {
            paddingTop: '50px'
        }
    }

    return (
        <div style={styles.adminConsoleContainer} className='adminConsoleContainer'>
            <AdminConsoleDevices/>
            <button onClick={closeAdminConsole}>Close</button>
        </div>
    )
}

export default AdminConsole;