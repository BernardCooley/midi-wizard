import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Colors from "../../styles/colors";
import { useSelector, useDispatch } from "react-redux";
import {
  showAudioConnectionsAction,
  showMidiConnectionsAction,
  makingConnectionAction,
} from "../../actions/index";
import { CustomButtonStyles } from "../../styles/components";
import { StarTwoTone } from "@material-ui/icons";
import { ControlPanel, Button } from "../../stories";
import { InputGroup } from "@wfp/ui";
import { controlPanelProps } from "./ComponentProps";
import Toggle from "react-toggle";
import "react-toggle/style.css";

const Styles = styled.div`
  position: absolute;
  left: 10px;
  top: 95px;
  z-index: 100;

  .toggle {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 5px;

    .react-toggle {
      margin-right: 10px;
      background-color: ${Colors.lightGray};
    }

    .react-toggle--checked .react-toggle-track {
      background-color: ${Colors.primaryButton};
    }
  }

  .workspaceControlsContainer {
    width: 130px;
    height: auto;
    background-color: ${Colors.lightGray};
    padding: 10px;
    padding-top: 0;
    border: 1px solid ${Colors.middleGray};
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    -webkit-box-shadow: 8px 10px 19px -2px rgba(0, 0, 0, 0.76);
    -moz-box-shadow: 8px 10px 19px -2px rgba(0, 0, 0, 0.76);
    box-shadow: 8px 10px 19px -2px rgba(0, 0, 0, 0.76);

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
          flex: 1 1 0px;
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
`;

const WorkspaceControls = (props) => {
  const dispatch = useDispatch();
  const showAudioConnections = useSelector(
    (state) => state.showAudioConnections
  );
  const showMidiConnections = useSelector((state) => state.showMidiConnections);
  const makingConnection = useSelector((state) => state.makingConnection);

  const audioCheckbox = useRef();
  const midiCheckbox = useRef();

  // const ShowHide = () => {
  //   return (
  //     <div className="controlsSectionContainer">
  //       <div className="controlsTitle">Show / Hide</div>
  //       <div className="checkboxContainer">
  //         <input
  //           onChange={updateShowHide}
  //           checked={showAudioConnections}
  //           ref={audioCheckbox}
  //           type="checkbox"
  //           className="showHideCheckbox"
  //         />
  //         <div className="showHideText">Audio</div>
  //       </div>
  //       <div className="checkboxContainer">
  //         <input
  //           onChange={updateShowHide}
  //           checked={showMidiConnections}
  //           ref={midiCheckbox}
  //           type="checkbox"
  //           className="showHideCheckbox"
  //         />
  //         <div className="showHideText">Midi</div>
  //       </div>
  //     </div>
  //   );
  // };

  const newConnection = (audioMidi) => {
    dispatch(makingConnectionAction(true));

    if (audioMidi === "audio") {
    } else if (audioMidi === "midi") {
    }
  };

  const cancelNewConnection = () => {
    dispatch(makingConnectionAction(false));
  };

  const NewConnection = () => {
    return (
      <div className="controlsSectionContainer">
        <div className="controlsTitle">New connection</div>
        <div className="buttonsContainer">
          {makingConnection ? (
            <CustomButtonStyles className="buttonOverride">
              <button
                onClick={cancelNewConnection}
                className="customButton newConnectionButton"
              >
                Cancel
              </button>
            </CustomButtonStyles>
          ) : (
            <div className="buttonsContainer">
              <CustomButtonStyles className="buttonOverride">
                <button
                  onClick={() => newConnection("audio")}
                  className="customButton newConnectionButton"
                >
                  Audio
                </button>
              </CustomButtonStyles>
              <CustomButtonStyles className="buttonOverride">
                <button
                  onClick={() => newConnection("midi")}
                  className="customButton newConnectionButton"
                >
                  Midi
                </button>
              </CustomButtonStyles>
            </div>
          )}
        </div>
      </div>
    );
  };

  const WorkspaceView = () => {
    return <div className="controlsSectionContainer">View</div>;
  };

  const updateShowHide = (event) => {
    if (event.target.name === "audio") {
      dispatch(showAudioConnectionsAction(event.target.checked));
    } else if (event.target.name === "midi") {
      dispatch(showMidiConnectionsAction(event.target.checked));
    } else if (event.target.name === "usb") {
      console.log("USB not implemented yet");
    }
  };

  return (
    <Styles>
      <ControlPanel {...controlPanelProps}>
        <InputGroup vertical>
          <div className="toggle">
            <Toggle
              value="audio"
              name="audio"
              defaultChecked={true}
              onChange={(e) => updateShowHide(e)}
            />
            <label htmlFor="audio">Audio</label>
          </div>
          <div className="toggle">
            <Toggle
              value="midi"
              name="midi"
              defaultChecked={true}
              onChange={(e) => updateShowHide(e)}
            />
            <label htmlFor="midi">Midi</label>
          </div>
          <div className="toggle">
            <Toggle
              value="usb"
              name="usb"
              defaultChecked={true}
              onChange={(e) => updateShowHide(e)}
            />
            <label htmlFor="usb">USB</label>
          </div>
        </InputGroup>
        <InputGroup labelText="New connection" vertical={true}>
          <Button label="Audio" backgroundColor={Colors.primaryButton} />
          <Button label="Midi" backgroundColor={Colors.primaryButton} />
          <Button label="USB" backgroundColor={Colors.primaryButton} />
        </InputGroup>
      </ControlPanel>
      {/* <div className='workspaceControlsContainer'>
                <ShowHide />
                <NewConnection />
                <WorkspaceView />
            </div> */}
    </Styles>
  );
};

WorkspaceControls.propTypes = {};

export default WorkspaceControls;
