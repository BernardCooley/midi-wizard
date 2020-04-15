import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt, faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from 'react-redux';
import { selectedLayoutId, isLayoutsTrayOpen, currentLayout, deletedLayoutId } from '../../actions';
import firebase from 'firebase';
import styled from 'styled-components';
import Colors from '../../styles/colors';


const Styles = styled.div`
    .layoutsTrayOuterContainer {
        position: fixed;
        top: 50%;
        right: -5px;
        transform: translate(0, -50%);
        display: flex;
        align-items: center;
        transition:0.6s;
        -webkit-transition:0.6s;
        -moz-transition:0.6s;

        .layoutsTabOpenClose {
            transform: rotate(-90deg);
            background-color: #383838;
            height: 30px;
            border: none;
            width: 120px;
            font-size: 20px;
            outline: none;
            border-radius: 5px 5px 0px 0px;
            cursor: pointer;
            position: relative;
            right: -45px;
            color: ${Colors.whiteBlue};
            z-index: 10;
            background: linear-gradient(rgba(211,211,211,1) 0%, rgba(137,137,137,1) 4%, rgba(56,56,56,1) 82%, rgba(56,56,56,1) 100%);

            &:hover {
                -webkit-box-shadow: 0px -7px 5px 0px rgba(49, 50, 50, 0.84);
                -moz-box-shadow: 0px -7px 5px 0px rgba(49, 50, 50, 0.84);
                box-shadow: 0px -7px 5px 0px rgba(49, 50, 50, 0.84);
                transition:0.2s;
                -webkit-transition:0.2s;
                -moz-transition:0.2s;
            }
        }

        .layoutsTrayContainer {
            height: 305px;
            width: auto;
            background-color: ${Colors.whiteBlue};
            padding: 10px;
            overflow: hidden;
            position: relative;
            background-color: #383838;
            -webkit-box-shadow: 0px 0px 6px 3px rgba(0,0,0,0.9);
            -moz-box-shadow: 0px 0px 6px 3px rgba(0,0,0,0.9);
            box-shadow: 0px 0px 6px 3px rgba(0,0,0,0.9);

            .layoutsListContainer {
                display: flex;
                flex-direction: column;
                height: 90%;
                justify-content: flex-start;
                align-items: flex-start;
                overflow-x: hidden;
                overflow-y: scroll;
                position: absolute;
                top: 40px;

                .layoutContainer {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 5px 0;
                    border-bottom: 1px solid gray;

                    .layoutNameContainer {
                        cursor: pointer;

                        .layoutName {
                            pointer-events: none;
                            border: none;
                            font-size: 14px;
                            background-color: #383838;
                            color: ${Colors.whiteBlue};
                        }

                        .editEnabled {
                            pointer-events: all;
                        }
                    }

                    .layoutActions {
                        display: flex;
                        flex-direction: row;

                        .layoutDeviceActionContainer {
                            margin: 3px;

                            .editIcon {
                                color: blue;
                            }

                            .deleteIcon {
                                color: red;
                            }
                        }
                    }

                    .svg {
                        pointer-events: none;
                    }
                }

                .layoutSelected {
                    border: 1px solid lightgreen;
                }
            }

            .newLayoutButtonsContainer {
                display: flex;
                justify-content: space-between;
                position: relative;

                .createNewLayoutButton {
                    width: 90px;
                }

                .newLayoutButtons {
                    height: 25px;
                    font-size: 13px;
                    cursor: pointer;
                    outline: none;
                    background-color: #383838;
                    color: ${Colors.whiteBlue};

                    &:hover {
                        background-color: ${Colors.whiteBlue};
                        color: #383838;
                    }
                }

                .copyLayoutButton {
                    width: 100px;
                }
            }
        }
    }

    .hidden {
        right: -210px;
    }
`

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
    const selectedLayout = useSelector(state => state.currentLayout);

    const [firstLoad, setFirstLoad] = useState(true);
    const [editEnabled, setEditEnabled] = useState(false);
    const [layoutIdBeingEdited, setLayoutIdBeingEdited] = useState('');
    const [layoutName, setLayoutName] = useState('');

    useEffect(() => {
        if (userLayouts.length > 0) {
            if (firstLoad) {
                dispatch(currentLayout(userLayouts[0]))
                dispatch(selectedLayoutId(userLayouts[0].layoutId));
                setFirstLoad(false);
                setLayoutName(userLayouts[0].layoutName);
            }
        }
    }, [userLayouts]);

    const deleteFromLayout = async e => {
        const clickedLayoutId = e.target.parentNode.parentNode.getAttribute('layoutid');

        if (clickedLayoutId !== currentLayoutId) {
            const confirmDelete = window.confirm("Delete layout?");

            if (confirmDelete) {
                dispatch(deletedLayoutId(e.target.parentNode.parentNode.getAttribute('layoutid')));

                const updatedUserLayoutIds = userLayoutIds.filter(layoutId => layoutId !== clickedLayoutId);

                await userDataRef.doc(currentUserId).update({
                    layouts: updatedUserLayoutIds
                }).then(() => {
                    dispatch(selectedLayoutId(updatedUserLayoutIds[0]));
                    userLayoutDataRef.doc(clickedLayoutId).delete();
                });
            }
        } else {
            alert('Currently selected layout cannot be deleted.');
        }
    }

    const renameLayout = e => {
        if (!editEnabled) {
            setEditEnabled(true);
            const editedLayoutId = e.target.parentNode.parentNode.getAttribute('layoutid');
            setLayoutIdBeingEdited(editedLayoutId);
            setLayoutName(userLayouts.filter(layout => layout.layoutId === editedLayoutId)[0].layoutName);
        } else {
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
        if (!editEnabled) {
            const layoutId = e.target.parentNode.getAttribute('layoutid');
            try {
                dispatch(selectedLayoutId(layoutId));
                dispatch(currentLayout(userLayouts.filter(layout => layout.layoutId === layoutId)[0]))
                toggleLayoutsTray();
            } catch (error) {
                console.error(error);
            }
        }
    }

    const addNewLayout = () => {
        const newLayout = {
            devices: [],
            layoutId: '',
            layoutName: 'New layout'
        }

        addNewLayoutToUserLayouts(addNewLayoutToLayouts(false, newLayout));
    }

    const addNewLayoutToLayouts = async (createCopy, newLayout) => {
        const newDocumentRef = await userLayoutDataRef.doc();

        newLayout.layoutId = newDocumentRef.id;
        newLayout.layoutName = createCopy ? `${newLayout.layoutName} new` : newLayout.layoutName;

        await newDocumentRef.set(newLayout);
        return newDocumentRef.id;
    }

    const addNewLayoutToUserLayouts = async newLayoutId => {
        userLayoutIds.push(await newLayoutId);

        await userDataRef.doc(currentUserId).update({
            layouts: userLayoutIds
        });
    }

    const copyLayout = () => {
        addNewLayoutToUserLayouts(addNewLayoutToLayouts(true, selectedLayout));
    }

    return (
        <Styles>
            <div className={`layoutsTrayOuterContainer ${!layoutsTrayOpen ? 'hidden' : ''}`}>
                <button onClick={toggleLayoutsTray} className={`layoutsTabOpenClose ${!layoutsTrayOpen ? 'open' : ''}`}>Layouts</button>
                <div className='layoutsTrayContainer'>
                    <div className='layoutsListContainer'>
                        {userLayouts.map((layout, index) => (
                            layout ?
                                <div layoutid={layout.layoutId} key={index} className={`layoutContainer ${currentLayoutId === layout.layoutId ? 'layoutSelected' : ''}`}>
                                    <div onClick={switchLayouts} className='layoutNameContainer'>
                                        <input onChange={updateLayoutNameField} type='text' value={editEnabled && layoutIdBeingEdited === layout.layoutId ? layoutName : layout.layoutName} className={`layoutName ${editEnabled ? 'editEnabled' : ''}`} />
                                    </div>
                                    <div className='layoutActions'>
                                        <div onClick={renameLayout} className='layoutDeviceActionContainer'>
                                            {editEnabled && layoutIdBeingEdited === layout.layoutId ?
                                                <FontAwesomeIcon className='svg editIcon' icon="check" /> :
                                                <FontAwesomeIcon className='svg editIcon' icon="edit" />
                                            }
                                        </div>
                                        <div onClick={deleteFromLayout} className='layoutDeviceActionContainer'>
                                            <FontAwesomeIcon className='svg deleteIcon' icon="trash-alt" />
                                        </div>
                                    </div>
                                </div> : null
                        ))}
                    </div>
                    <div className='newLayoutButtonsContainer'>
                        <button onClick={addNewLayout} className='createNewLayoutButton newLayoutButtons'>New layout</button>
                        <button onClick={copyLayout} className='copyLayoutButton newLayoutButtons'>Copy to new</button>
                    </div>
                </div>
            </div>
        </Styles>
    )
}

export default LayoutsTray;