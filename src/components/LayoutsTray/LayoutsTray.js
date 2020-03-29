import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt, faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from 'react-redux';
import { selectedLayoutId, isLayoutsTrayOpen, currentLayout } from '../../actions';
import firebase from 'firebase';

const LayoutsTray = () => {

    library.add(faTrashAlt, faEdit, faCheck);

    const db = firebase.firestore();
    const userLayoutDataRef = db.collection('UserLayouts');
    const userDataRef = db.collection('UserDeviceData');

    const dispatch = useDispatch();
    const userLayouts = useSelector(state => state.layouts);
    const layoutsTrayOpen = useSelector(state => state.isLayoutsTrayOpen);
    const currentLayoutId = useSelector(state => state.selectedLayoutId);
    const currentUserId = useSelector(state => state.currentUserId);
    const userLayoutIds = useSelector(state => state.layoutIds);

    const [firstLoad, setFirstLoad] = useState(true);
    const [editEnabled, setEditEnabled] = useState(false);
    const [layoutIdBeingEdited, setLayoutIdBeingEdited] = useState('');
    const [layoutName, setLayoutName] = useState('');

    useEffect(() => {
        if(userLayouts.length > 0) {
            if(firstLoad) {
                dispatch(currentLayout(userLayouts[0]))
                dispatch(selectedLayoutId(userLayouts[0].layoutId));
                setFirstLoad(false);
                setLayoutName(userLayouts[0].layoutName);
            }
        }
    }, [userLayouts]);

    const deleteFromLayout = e => {
        const confirmDelete = window.confirm("Delete layout?");

        if(confirmDelete) {
            // console.log(e.target.parentNode.parentNode.getAttribute('layoutid'));
            // console.log('deleteFromLayout');
        }
    }

    const renameLayout = e => {
        if(!editEnabled) {
            setEditEnabled(true);
            const editedLayoutId = e.target.parentNode.parentNode.getAttribute('layoutid');
            setLayoutIdBeingEdited(editedLayoutId);
            setLayoutName(userLayouts.filter(layout => layout.layoutId === editedLayoutId)[0].layoutName);
        }else {
            updateLayoutName(layoutName);
            setEditEnabled(false);
        }
    }

    const updateLayoutName = async newLayoutName => {
        await userLayoutDataRef.doc(layoutIdBeingEdited).update({
            layoutName: newLayoutName
        });
    }

    const updateLayoutNameField = e => {
        setLayoutName(e.target.value);
    }

    const toggleLayoutsTray = () => {
        dispatch(isLayoutsTrayOpen());
    }

    const switchLayouts = e => {
        if(!editEnabled) {
            const layoutId = e.target.parentNode.getAttribute('layoutid');
            dispatch(selectedLayoutId(layoutId));
            dispatch(currentLayout(userLayouts.filter(layout => layout.layoutId === layoutId)[0]))
            toggleLayoutsTray();
        }
    }

    const addNewLayout = () => {
        addNewLayoutToUserLayouts(addNewLayoutToLayouts());
    }

    const addNewLayoutToLayouts = async () => {
        const newDocumentRef = await userLayoutDataRef.doc();

        const newLayout = {
            devices: [],
            layoutId: newDocumentRef.id,
            layoutName: 'New layout'
        }

        await newDocumentRef.set(newLayout);
        return newDocumentRef.id;
    }

    const addNewLayoutToUserLayouts = async newLayoutId => {
        userLayoutIds.push(await newLayoutId);

        await userDataRef.doc(currentUserId).update({
            layouts: userLayoutIds
        });
    }

    const styles = {
        layoutsTrayOuterContainer: {
            position: 'fixed',
            top: '50%',
            right: '0',
            transform: 'translate(0, -50%)',
            display: 'flex',
            alignItems: 'center',
            transition:'0.6s',
            EebkitTransition:'0.6s',
            MozTransition:'0.6s',
        },
        layoutsTrayContainer: {
            height: '250px',
            width: 'auto',
            backgroundColor: 'white',
            padding: '10px',
            overflowX: 'auto'
        },
        layoutsTabOpenClose: {
            transform: 'rotate(-90deg)',
            backgroundColor: 'white',
            height: '30px',
            border: 'none',
            width: '120px',
            fontSize: '20px',
            outline: 'none',
            borderRadius: '5px 5px 0px 0px',
            cursor: 'pointer',
            position: 'relative',
            right: '-45px'
        },
        layoutsListContainer: {
            display: 'flex',
            flexDirection: 'column',
            height: '90%',
            justifyContent:' flex-start',
            alignItems:' flex-start'
        },
        layoutContainer: {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '5px 0',
            borderBottom: '1px solid gray'
        },
        layoutNameContainer: {
            cursor: 'pointer'
        },
        layoutName: {
            pointerEvents: 'none',
            border: 'none',
            fontSize: '14px'
        },
        layoutActions: {
            display: 'flex',
            flexDirection: 'row'
        },
        svg: {
            pointerEvents: 'none'
        },
        layoutDeviceActionContainer: {
            margin: '3px'
        },
        deleteIcon: {
            color: 'red'
        },
        editIcon: {
            color: 'blue'
        },
        confirmEditIcon: {
            color: 'green'
        },
        hidden: {
            right: '-215px'
        },
        layoutSelected: {
            border: '1px solid lightgreen'
        },
        editEnabled: {
            pointerEvents: 'all'
        },
        newLayoutButton: {
            height: '25px',
            width: '90px',
            fontSize: '13px'
        }
    }

    return (
        <div style={{...styles.layoutsTrayOuterContainer, ...!layoutsTrayOpen ? styles.hidden : ''}} className='layoutsTrayOuterContainer'>
            <button onClick={toggleLayoutsTray} style={styles.layoutsTabOpenClose} className='layoutsTabOpenClose' onClick={toggleLayoutsTray}>Layouts</button>
            <div className='layoutsTrayContainer' style={styles.layoutsTrayContainer}>
                <div style={styles.layoutsListContainer} className='layoutsListContainer'>
                    {userLayouts.map((layout, index) => (
                        <div layoutid={layout.layoutId} key={index} style={{...styles.layoutContainer, ...currentLayoutId === layout.layoutId ? styles.layoutSelected : ''}} className='layoutContainer'>
                            <div onClick={switchLayouts} style={styles.layoutNameContainer} className='layoutNameContainer'>
                                <input onChange={updateLayoutNameField} type='text' value={editEnabled && layoutIdBeingEdited === layout.layoutId ? layoutName : layout.layoutName} style={{...styles.layoutName, ...editEnabled ? styles.editEnabled : ''}} className='layoutName'/>
                            </div>
                            <div style={styles.layoutActions} className='layoutActions'>
                                <div style={styles.layoutDeviceActionContainer} onClick={renameLayout} className='layoutDeviceActionContainer'>
                                    {editEnabled && layoutIdBeingEdited === layout.layoutId ?
                                        <FontAwesomeIcon style={{...styles.svg, ...styles.editIcon}} icon="check" />:
                                        <FontAwesomeIcon style={{...styles.svg, ...styles.editIcon}} icon="edit" />
                                    }
                                </div>
                                <div style={styles.layoutDeviceActionContainer} onClick={deleteFromLayout} className='layoutDeviceActionContainer'>
                                    <FontAwesomeIcon style={{...styles.svg, ...styles.deleteIcon}} icon="trash-alt" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addNewLayout} style={styles.newLayoutButton} className='newLayoutButton'>New layout</button>
            </div>
        </div>
    )
}

export default LayoutsTray;