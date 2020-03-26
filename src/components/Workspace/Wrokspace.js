import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectedLayoutId, currentLayout } from '../../actions';
import firebase from 'firebase';

const Workspace = () => {

    const db = firebase.firestore();
    const dispatch = useDispatch();
    const currentLayoutId = useSelector(state => state.selectedLayoutId);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const userLayouts = useSelector(state => state.layouts);
    const layout = useSelector(state => state.currentLayout);

    useEffect(() => {
        if(userLayouts.length > 0) {
            dispatch(selectedLayoutId(userLayouts[selectedIndex].layoutId));
        }
    }, [userLayouts]);

    useEffect(() => {
        if(userLayouts.length > 0) {
            dispatch(currentLayout(userLayouts.filter(layout => layout.layoutId === currentLayoutId)[0]));
        }
    }, [currentLayoutId]);

    const changeLayout = e => {
        setSelectedIndex(e.target.options[e.target.selectedIndex].index);
        dispatch(selectedLayoutId(e.target.options[e.target.selectedIndex].value));
        getCurrentLayout(e.target.options[e.target.selectedIndex].value);
    }

    const getCurrentLayout = layoutId => {
        dispatch(currentLayout(userLayouts.filter(layout => layout.layoutId ===layoutId)[0]));
    }

    const styles = {
        workSpaceContainer: {
            backgroundColor: 'lightblue',
            width: '100%',
            height: '100%',
            padding: '20px 0',
            display: 'flex',
            paddingTop: '50px'
        },
        layoutSelectContainer: {
            position: 'absolute',
            top: '60px',
            display: 'flex',
            flexDirection: 'column',
            height: '45px',
            justifyContent: 'space-between',
            right: '8px'
        },
        layoutSelect: {
            height: '30px',
            width: '150px'
        }
    }

    return (
        <div style={styles.workSpaceContainer}>
            <div style={styles.layoutSelectContainer} className='layoutSelectContainer'>
                <select onChange={changeLayout} style={styles.layoutSelect} className='layoutSelect' id="studioLayout">
                    <option disabled>Choose layout</option>
                    {userLayouts.map((layout, index) => (
                        <option key={index} value={layout.layoutId} selected={index === selectedIndex}>{layout.layoutName}</option>
                    ))}
                </select>
            </div>

            <div>{layout.layoutName}</div>
            {/* {layout.devices ? layout.devices.map((device, index) => (
                    <div key={index}>{device.deviceId}</div>
                )): null
            } */}
        </div>
    )
}

export default Workspace;