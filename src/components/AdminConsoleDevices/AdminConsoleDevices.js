import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const AdminConsoleDevices = () => {

    const dispatch = useDispatch();
    const stockDevices = useSelector(state => state.stockDevices);

    const styles = {
        deviceTable: {
            margin: 'auto'
        }
    }

    return (
        <div className='adminConsoleDeivcesContainer'>
            <table style={styles.deviceTable} className='deviceTable'>
                <thead>
                    <tr>
                        <th>Device Id</th>
                        <th>Manufacturer</th>
                        <th>Device name</th>
                        <th>Audio outs</th>
                        <th>Audio ins</th>
                        <th>Midi out</th>
                        <th>Midi in</th>
                        <th>Midi thru</th>
                    </tr>
                </thead>
                <tbody>
                    {stockDevices.map((device, index) => (
                        <tr key={index}>
                            <td className='consoleDeviceField'>{device.deviceId}</td>
                            <td className='consoleDeviceField'>{device.deviceName}</td>
                            <td className='consoleDeviceField'>{device.manufacturer}</td>
                            <td className='consoleDeviceField'>{device.audio.ins}</td>
                            <td className='consoleDeviceField'>{device.audio.outs}</td>
                            <td className='consoleDeviceField'>{device.midi.in.toString()}</td>
                            <td className='consoleDeviceField'>{device.midi.out.toString()}</td>
                            <td className='consoleDeviceField'>{device.midi.thru.toString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default AdminConsoleDevices;