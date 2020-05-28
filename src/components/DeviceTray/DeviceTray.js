import React from 'react';
import TrayDevice from './TrayDevice';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toggleAddDeviceForm, isDeviceTrayOpen } from '../../actions';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import { TrayTabStyles } from '../../styles/components';


const Styles = styled.div`
    .deviceTrayContainer {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        scrollbar-color: red;
        position: fixed;
        bottom: -52px;
        transition:0.6s;
        -webkit-transition:0.6s;
        -moz-transition:0.6s;
        right: 0;
        z-index: 50;

        .devicesListContainer {
            display: flex;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
            width: 100%;
            background-color: #383838;
            flex-direction: column;
            -webkit-box-shadow: 0px -4px 5px 0px rgba(0,0,0,0.75);
            -moz-box-shadow: 0px -4px 5px 0px rgba(0,0,0,0.75);
            box-shadow: 0px -4px 5px 0px rgba(0,0,0,0.75);
            color: ${Colors.whiteBlue};

            .deviceTab {
                top: -29px;
                border-radius: 5px 5px 0 0;
            }

            .deviceListInnerContainer {
                display: flex;
                align-items: center;
                width: 98%;
                position: relative;
                top: -30px;
                height: 208px;

                .listContainer {
                    display: flex;
                    align-items: center;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    margin: auto;
                    overflow-y: auto;
                    justify-content: center;
                    padding-left: 155px;

                    .addFirstDevice {
                        font-size: 30px;
                        text-align: center;
                        cursor: pointer;

                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }

                .openAddDeviceFormButton {
                    border-radius: 25px;
                    padding: 10px;
                    height: 25px;
                    margin-left: 20px;
                    cursor: pointer;
                    transition:0.2s;
                    -webkit-transition:0.2s;
                    -moz-transition:0.2s;

                    &:hover {
                        transform: scale(1.4);
                    }

                    .svg {
                        font-size: 25px;
                    }
                }
            }
        }
    }
    .closed {
        bottom: -237px;
    }
    .hidden {
        display: none;
    }
`

const DeviceTray = () => {

    library.add(faPlus);
    const dispatch = useDispatch();
    const userData = useSelector(state => state.userData);
    const isAddDeviceFormOpen = useSelector(state => state.isAddDeviceFormOpen);
    const deviceTrayOpen = useSelector(state => state.isDeviceTrayOpen);

    const toggleDeviceTray = () => {
        dispatch(isDeviceTrayOpen());
        dispatch(toggleAddDeviceForm(false));
    }

    return (
        <Styles>
            <div className={`deviceTrayContainer ${!deviceTrayOpen ? 'closed' : ''}`}>
                <div className='devicesListContainer'>
                    <TrayTabStyles>
                        <button onClick={toggleDeviceTray} className={`trayTab deviceTab ${!deviceTrayOpen ? 'open' : ''}`}>Devices</button>
                    </TrayTabStyles>
                    <div className='deviceListInnerContainer'>
                        <div className={`listContainer ${!deviceTrayOpen ? 'closed' : ''}`}>
                            {userData.devices && userData.devices.length < 1 ?
                                <div className='addFirstDevice' onClick={() => dispatch(toggleAddDeviceForm(true))}>Add first device</div>
                                : null
                            }
                            {userData.devices && userData.devices.length > 0 ? userData.devices.map((device, index) => (
                                <TrayDevice key={index} device={device} />
                            )) : null}
                        </div>
                        {!isAddDeviceFormOpen && userData.devices && userData.devices.length > 0 ?
                            <div className={'openAddDeviceFormButton'} onClick={() => dispatch(toggleAddDeviceForm(true))}>
                                <FontAwesomeIcon className='svg' icon="plus" />
                            </div>
                            :
                            null
                        }
                    </div>
                </div>
            </div>
        </Styles>
    );
}

export default DeviceTray;