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


    return (
        <div className='toggleDeviceTrayContainer' onClick={() => dispatch(isDeviceTrayOpen())}>
            <div className='deviceTrayLabel'>Device tray</div>
            <FontAwesomeIcon className={deviceTrayOpen ? 'deviceTrayOpen' : ''} icon="chevron-up" />
        </div>
    )
}

export default ToggleDeviceTray;