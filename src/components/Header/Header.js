import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAdminConsole } from '../../actions';
import styled from 'styled-components';

const Styles = styled.div`
    .headerContainer {
        width: 100%;
        background-color: rebeccapurple;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        border-bottom: 1px solid #666666;

        .buttonContainer {
            height: 100%;
            align-items: center;
            justify-content: center;
            flex-grow: 1;
            flex-basis: 0;
            height: 100%;
            display: flex;
            justify-content: flex-start;
        }

        .button {
            height: auto;
            margin: 0 10px;
            cursor: pointer;
            width: auto;
            outline: none;
            padding: 8px;
            font-size: 16px;
            background-color: #383838;
            color: white;
        }

        .buttonHighlighed {
            outline: 3px solid #2ef12b;
        }

        .titleContainer {
            flex-grow: 1;
            flex-basis: 0;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            .appTitle {
                color: white;
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

            .userName {
                color: #cecece;
            }
        }
    }
`

const Header = () => {

    const dispatch = useDispatch();
    const isAdmin = useSelector(state => state.isAdmin);
    const isAdminConsoleOpen = useSelector(state => state.isAdminConsoleOpen);
    const currentUsername = useSelector(state => state.currentUsername);
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        setFirstName(getFirstName());
    }, [currentUsername]);

    const logout = () => {
        firebase.auth().signOut();
    }

    const getFirstName = () => {
        return currentUsername.replace(/ .*/,'');
    }

    const openCloseAdminConsole = () => {
        if(!isAdminConsoleOpen) {
            dispatch(toggleAdminConsole(true));
        }else {
            dispatch(toggleAdminConsole(false));
        }
    }

    return (
        <Styles>
            <div className='headerContainer'>
                <div className='buttonContainer'>
                    {isAdmin ? 
                        <button className={`button ${isAdminConsoleOpen ? 'buttonHighlighed' : ''}`} onClick={openCloseAdminConsole}>Admin console</button>: null
                    }
                </div>
                <div className='titleContainer'>
                    <div className='appTitle'>Studio Designer</div>
                </div>
                <div className='accountActionsContainer'>
                    <div className='userName'>Welcome {firstName}</div>
                    <button className='button' onClick={logout}>Logout</button>
                </div>
            </div>
        </Styles>
    )
}

export default Header;