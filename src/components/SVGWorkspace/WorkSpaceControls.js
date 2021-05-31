import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import { useSelector, useDispatch } from 'react-redux';
import { showAudioConnectionsAction, showMidiConnectionsAction } from '../../actions/index';
import { CustomButtonStyles } from '../../styles/components';

const Styles = styled.div`
    position: absolute;
    left: 10px;
    top: 60px;
    z-index: 100;

    .workspaceControlsContainer {
        width: 130px;
        height: auto;
        background-color: ${Colors.middleGray2};
        padding: 10px;
        padding-top: 0;
        border: 1px solid ${Colors.middleGray};
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        -webkit-box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
        -moz-box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
        box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);

        .controlsSectionContainer {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            border-bottom: 1px solid ${Colors.middleGray};
            padding-top: 10px;
            padding-bottom: 10px;

            .controlsTitle {
                margin-bottom: 10px;
            }

            .checkboxContainer {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .showHideCheckbox {
                    margin-right: 5px;
                }
            }

            .buttonsContainer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;

                .buttonOverride {
                    flex: 1 1 0px
                }

                .newConnectionButton {
                    width: 100%;
                    height: 30px;
                    font-size: 16px;
                    border-radius: 5px;
                    margin: 5px;
                }
            }
        }
    }
`

const WorkspaceControls = props => {

    const dispatch = useDispatch();
    const showAudioConnections = useSelector(state => state.showAudioConnections);
    const showMidiConnections = useSelector(state => state.showMidiConnections);

    const audioCheckbox = useRef();
    const midiCheckbox = useRef();

    const updateShowHide = () => {
        dispatch(showAudioConnectionsAction(audioCheckbox.current.checked));
        dispatch(showMidiConnectionsAction(midiCheckbox.current.checked));
    }


    const ShowHide = () => {
        return (
            <div className='controlsSectionContainer'>
                <div className='controlsTitle'>Show / Hide</div>
                <div className='checkboxContainer'>
                    <input onChange={updateShowHide} checked={showAudioConnections} ref={audioCheckbox} type='checkbox' className='showHideCheckbox' />
                    <div className='showHideText'>Audio</div>
                </div>
                <div className='checkboxContainer'>
                    <input onChange={updateShowHide} checked={showMidiConnections} ref={midiCheckbox} type='checkbox' className='showHideCheckbox' />
                    <div className='showHideText'>Midi</div>
                </div>
            </div>
        )
    }

    const newAudioConnection = () => {

    }

    const newMidiConnection = () => {
        
    }

    const NewConnection = () => {
        return (
            <div className='controlsSectionContainer'>
                <div className='controlsTitle'>New connection</div>
                <div className='buttonsContainer'>
                    <CustomButtonStyles className='buttonOverride'>
                    <button onClick={newAudioConnection} className='customButton newConnectionButton'>Audio</button>
                    </CustomButtonStyles>
                    <CustomButtonStyles className='buttonOverride'>
                    <button onClick={newMidiConnection} className='customButton newConnectionButton'>Midi</button>
                    </CustomButtonStyles>
                </div>
            </div>
        )
    }

    const WorkspaceView = () => {
        return (
            <div className='controlsSectionContainer'>
                View
            </div>
        )
    }

    return (
        <Styles>
            <div className='workspaceControlsContainer'>
                <ShowHide />
                <NewConnection />
                <WorkspaceView />
            </div>
        </Styles>
    )
}

WorkspaceControls.propTypes = {

}

export default WorkspaceControls;