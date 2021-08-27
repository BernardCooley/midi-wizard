import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleAdminConsole, isManageAccountPageOpen } from "../../actions";
import styled from "styled-components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { CustomButtonStyles } from "../../styles/components";
import Colors from "../../styles/colors";
import logo from "../../images/logo.png";
import AccountIcon from "../../icons/user.svg";
import { Button } from "../../stories";

const Styles = styled.div`
  .headerContainer {
    width: 100%;
    background-color: ${Colors.jet};
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    border-bottom: 1px solid #666666;
    z-index: 50;
    padding-left: 20px;

    .buttonContainer {
      height: 100%;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      flex-basis: 0;
      height: 100%;
      display: flex;
      justify-content: flex-start;

      .adminConsoleButton {
        width: 175px;
        height: 30px;
        font-size: 16px;
        border-radius: 5px;
        margin-left: 10px;
      }
    }

    .buttonActive {
      background-color: ${Colors.darkTeal};
    }

    .titleContainer {
      flex-grow: 1;
      flex-basis: 0;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .logoImage {
        height: 30px;
        width: 215px;
        margin: auto;
      }

      .appTitle {
        color: ${Colors.whiteBlue};
        font-size: 30px;
        text-align: center;
        font-weight: bold;
      }
    }

    .accountActionsContainer {
      flex-grow: 1;
      flex-basis: 0;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .openAccountIcon {
        color: ${Colors.whiteBlue};
        height: 30px;
        margin: 0 10px;
        cursor: pointer;
        transition: 0.2s;
        -webkit-transition: 0.2s;
        -moz-transition: 0.2s;

        &:hover {
          transform: scale(1.2);
          -webkit-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
          -moz-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
          box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
        }
      }

      .userName {
        color: ${Colors.whiteBlue};
      }
    }
  }
`;

const HeaderOld = () => {
  const dispatch = useDispatch();
  library.add(faUserCircle);
  const isAdmin = useSelector((state) => state.isAdmin);
  const isAdminConsoleOpen = useSelector((state) => state.isAdminConsoleOpen);
  const allStockDevices = useSelector((state) => state.allStockDevices);
  const [numberOfUnverifiedDevices, setNumberOfUnverifiedDevices] = useState(
    ""
  );

  useEffect(() => {
    setNumberOfUnverifiedDevices(getUnverifiedDevices());
  }, [allStockDevices]);

  const getUnverifiedDevices = () => {
    return allStockDevices.filter((device) => device.verified === false).length;
  };

  const openCloseAdminConsole = () => {
    if (!isAdminConsoleOpen) {
      dispatch(isManageAccountPageOpen(false));
      dispatch(toggleAdminConsole(true));
    } else {
      dispatch(toggleAdminConsole(false));
    }
  };

  const openAccountPage = () => {
    dispatch(isManageAccountPageOpen(true));
  };

  return (
    <Styles>
      <div className="headerContainer">
        <div className="buttonContainer">
          {isAdmin && (
            <Button
              primary={true}
              size="medium"
              label="Admin console"
              onClick={openCloseAdminConsole}
            />
          )}
        </div>
        <div className="titleContainer">
          <img src={logo} className="logoImage"></img>
        </div>
        <div className="accountActionsContainer">
          <img
            src={AccountIcon}
            onClick={openAccountPage}
            className="openAccountIcon"
          ></img>
        </div>
      </div>
    </Styles>
  );
};

export default HeaderOld;
