import React from 'react';
import './DevieOptions.scss';

const DevieOptions = () => {

    const addToWorkspace = () => {
        console.log('addToWorkspace');
    }

    const removeFromDeviceTray = () => {
        console.log('removeFromDeviceTray');
    }

    return (
        <div className='devieOptionsContainer'>
            <div className='optionsListContainer'>
                <div>
                    <div className='optionsItem' onClick={addToWorkspace}>Add to workspace</div>
                    <div className='optionsItem' onClick={removeFromDeviceTray}>Remove from device tray</div>
                </div>
            </div>
        </div>
    )
}

export default DevieOptions;