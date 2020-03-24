import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleAdminConsole } from '../../actions';

const AdminConsole = () => {

    const dispatch = useDispatch();

    const closeAdminConsole = () => {
        dispatch(toggleAdminConsole(false));
    }

    const styles = {
        adminConsoleContainer: {

        }
    }

    return (
        <div className='adminConsoleContainer'>
            Admin Console
            <button onClick={closeAdminConsole}>Close</button>
        </div>
    )
}

export default AdminConsole;