import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAdminConsole, isManageAccountPageOpen } from '../../actions';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { CustomButton } from '../../styles/components';
import Colors from '../../styles/colors';

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
                font-size: 30px;
                margin: 0 10px;
                cursor: pointer;

                &:hover {
                    font-size: 35px;
                }
            }

            .userName {
                color: ${Colors.whiteBlue};
            }
        }
    }
`

const Header = () => {

    const dispatch = useDispatch();
    library.add(faUserCircle);
    const isAdmin = useSelector(state => state.isAdmin);
    const isAdminConsoleOpen = useSelector(state => state.isAdminConsoleOpen);
    const currentUsername = useSelector(state => state.currentUsername);
    const [firstName, setFirstName] = useState('');
    const stockDevices = useSelector(state => state.stockDevices);
    const [numberOfUnverifiedDevices, setNumberOfUnverifiedDevices] = useState('');

    useEffect(() => {
        setFirstName(getFirstName());
    }, [currentUsername]);

    useEffect(() => {
        setNumberOfUnverifiedDevices(getUnverifiedDevices());
    }, [stockDevices]);

    const getUnverifiedDevices = () => {
        return stockDevices.filter(device => device.verified === false).length;
    }

    const getFirstName = () => {
        return currentUsername.replace(/ .*/, '');
    }

    const openCloseAdminConsole = () => {
        if (!isAdminConsoleOpen) {
            dispatch(isManageAccountPageOpen(false));
            dispatch(toggleAdminConsole(true));
        } else {
            dispatch(toggleAdminConsole(false));
        }
    }

    const openAccountPage = () => {
        dispatch(isManageAccountPageOpen(true));
    }

    return (
        <Styles>
            <div className='headerContainer'>
                <div className='buttonContainer'>
                    {isAdmin ?
                        <>
                            <CustomButton>
                                <button className={`customButton adminConsoleButton ${isAdminConsoleOpen ? 'buttonActive' : ''}`} active={isAdminConsoleOpen ? true : false} onClick={openCloseAdminConsole}>Admin console {numberOfUnverifiedDevices}</button>
                            </CustomButton>
                        </>
                        : null
                    }
                </div>
                <div className='titleContainer'>
                    <div className='appTitle'>Studio Designer</div>
                </div>
                <div className='accountActionsContainer'>
                    <div className='userName'>Welcome {firstName}</div>
                    <FontAwesomeIcon onClick={openAccountPage} className='svg openAccountIcon' icon="user-circle" />
                </div>
            </div>
        </Styles>
    )
}

export default Header;