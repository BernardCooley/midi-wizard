import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase';
import LayoutsTray from '../LayoutsTray/LayoutsTray';
import { currentLayout } from '../../actions';
import SVGWorkspace from '../SVGWorkspace/SVGWorkspace';
import styled from 'styled-components';


const Styles = styled.div`
    .workSpaceContainer {
        background-color: lightblue;
        width: 100vw;
        height: 100vh;
        display: flex;
    }
`

const Workspace = () => {

    const db = firebase.firestore();
    const userLayoutDataRef = db.collection('UserLayouts');

    const dispatch = useDispatch();
    const layout = useSelector(state => state.currentLayout);
    const userLayouts = useSelector(state => state.layouts);
    const currentLayoutId = useSelector(state => state.selectedLayoutId);
    const currentDeletedLayoutId = useSelector(state => state.deletedLayoutId);

    useEffect(() => {
        if(userLayouts.length > 0) {
            if(userLayouts !== 'undefined' && currentLayoutId && currentLayoutId !== currentDeletedLayoutId) {
                const removedUndefined = userLayouts.filter(layout => layout);
                dispatch(currentLayout(removedUndefined.filter(layout => layout.layoutId === currentLayoutId)[0]));
            }
        }
    }, [userLayouts]);

    useEffect(() => {
        if(userLayouts.length > 0) {
            dispatch(currentLayout(userLayouts.filter(layout => layout.layoutId === currentLayoutId)[0]));
        }
    }, [currentLayoutId]);

    const removeFromLayout = async e => {
        const confirmDelete = window.confirm("Delete from layout");

        if(confirmDelete) {
            const deviceId = e.target.parentNode.getAttribute('deviceid');
    
            const updatedLayoutDevices = layout.devices.filter(device => device.deviceId !== deviceId);

            userLayoutDataRef.doc(layout.layoutId).set({
                'layoutId': layout.layoutId,
                'layoutName': layout.layoutName,
                'devices': updatedLayoutDevices
            });
        }
    }

    return (
        <Styles>
            <div className='workSpaceContainer'>
                <SVGWorkspace layout={layout}/>
                <LayoutsTray/>
            </div>
        </Styles>
    )
}

export default Workspace;