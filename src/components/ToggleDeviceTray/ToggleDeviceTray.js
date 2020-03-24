import React from 'react';
import './ToggleDeviceTray.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { isDeviceTrayOpen } from '../../actions';
import { useSelector, useDispatch } from 'react-redux';

const ToggleDeviceTray = () => {

    const dispatch = useDispatch();
    const deviceTrayOpen = useSelector(state => state.isDeviceTrayOpen);

    library.add(faChevronUp);


    const toggleDeviceTray = () => {
        dispatch(isDeviceTrayOpen());
    }

    const styles = {
        toggleDeviceTrayContainer: {
            margin: '2px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
        },
        deviceTrayLabel: {
            marginRight: '10px'
        },
        svg: {
            fontSize: '20px',
            color: 'gray'
        }
    }

    return (
        <div style={styles.toggleDeviceTrayContainer} onClick={toggleDeviceTray}>
            <div style={styles.deviceTrayLabel}>Device tray</div>
            <FontAwesomeIcon style={styles.svg} className={deviceTrayOpen ? 'deviceTrayOpen' : ''} icon="chevron-up" />
        </div>
    )
}

export default ToggleDeviceTray;