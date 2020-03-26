import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getWorkspaceDevices, selectedLayoutId, layouts, currentLayout } from '../../actions';
import UserDevice from '../UserDevice/UserDevice';
import firebase from 'firebase';

const Workspace = () => {

    const db = firebase.firestore();
    const userDataRef = db.collection('UserDeviceData');
    const userLayoutDataRef = db.collection('UserLayouts');
    const dispatch = useDispatch();
    const currentLayoutId = useSelector(state => state.selectedLayoutId);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const userLayouts = useSelector(state => state.layouts);
    const userId = useSelector(state => state.currentUserId);

    useEffect(() => {
        if(userId.length > 0) {
            getLayouts(getLayoutIds());
        }
    }, [userId]);

    useEffect(() => {
        if(userLayouts.length > 0) {
            dispatch(selectedLayoutId(userLayouts[selectedIndex].layoutId));
        }
    }, [userLayouts]);

    const changeLayout = e => {
        setSelectedIndex(e.target.options[e.target.selectedIndex].index);
        dispatch(selectedLayoutId(e.target.options[e.target.selectedIndex].value));
        getCurrentLayout(e.target.options[e.target.selectedIndex].value);
    }

    const getCurrentLayout = layoutId => {
        dispatch(currentLayout(userLayouts.filter(layout => layout.layoutId ===layoutId)[0]));
    }

    const getLayoutIds = async () => {
        const layoutIdsResponse = await userDataRef.doc(userId).get()

        return layoutIdsResponse.data().layouts;
    }

    const getLayouts = async layoutIds => {
        const uLayouts = [];

        for (const id of await layoutIds) {
            const response = await userLayoutDataRef.doc(id).get();
            uLayouts.push(response.data());
        }

        dispatch(layouts(uLayouts));
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
        </div>
    )
}

export default Workspace;