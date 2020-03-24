import React from 'react';

const DevieOptions = () => {

    const addToWorkspace = () => {
        console.log('addToWorkspace');
    }

    const removeFromDeviceTray = () => {
        console.log('removeFromDeviceTray');
    }

    const styles = {

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