import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt, faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from 'react-redux';
import { selectedLayoutId, isLayoutsTrayOpen, currentLayout } from '../../actions';

const LayoutsTray = () => {

    library.add(faTrashAlt, faEdit, faCheck);

    const dispatch = useDispatch();
    const userLayouts = useSelector(state => state.layouts);
    const layoutsTrayOpen = useSelector(state => state.isLayoutsTrayOpen);
    const currentLayoutId = useSelector(state => state.selectedLayoutId);
    const [firstLoad, setFirstLoad] = useState(true);
    const [editEnabled, setEditEnabled] = useState(false);
    const [layoutIdBeingEdited, setLayoutIdBeingEdited] = useState('');

    useEffect(() => {
        if(userLayouts.length > 0) {
            if(firstLoad) {
                dispatch(currentLayout(userLayouts[0]))
                dispatch(selectedLayoutId(userLayouts[0].layoutId));
                setFirstLoad(false);
            }
        }
    }, [userLayouts]);

    const deleteFromLayout = e => {
        const confirmDelete = window.confirm("Delete layout?");

        if(confirmDelete) {
            console.log(e.target.parentNode.parentNode.getAttribute('layoutid'));
            console.log('deleteFromLayout');
        }
    }

    const renameLayout = e => {
        if(!editEnabled) {
            setEditEnabled(true);
            setLayoutIdBeingEdited(e.target.parentNode.parentNode.getAttribute('layoutid'));
        }else {
            setEditEnabled(false);
        }
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

    const updateLayoutName = e => {
        console.log(e.target.value);
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
                                <input onChange={updateLayoutName} type='text' value={layout.layoutName} style={{...styles.layoutName, ...editEnabled ? styles.editEnabled : ''}} className='layoutName'/>
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
            </div>
        </div>
    )
}

export default LayoutsTray;