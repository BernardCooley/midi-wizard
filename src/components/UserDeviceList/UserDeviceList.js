import React, { useEffect } from 'react';
import UserDevice from '../UserDevice/UserDevice';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toggleAddDeviceForm, isDeviceTrayOpen } from '../../actions';
import firebase from 'firebase';
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
            bottom: -30px;
            transition:0.6s;
            -webkit-transition:0.6s;
            -moz-transition:0.6s;
            right: 0;

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
                top: -35px;
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

const UserDeviceList = () => {

    library.add(faPlus);
    const dispatch = useDispatch();
    const userDevices = useSelector(state => state.userDevices);
    const userData = useSelector(state => state.userData);
    const isAddDeviceFormOpen = useSelector(state => state.isAddDeviceFormOpen);
    const deviceTrayOpen = useSelector(state => state.isDeviceTrayOpen);

    useEffect(() => {
        getImageUrls();
    }, [userDevices]);

    useEffect(() => {
        getImageUrls();
    }, [userData.devices]);

    const toggleDeviceTray = () => {
        dispatch(isDeviceTrayOpen());
        dispatch(toggleAddDeviceForm(false));
    }

    const getImageUrls = async () => {
        if (userData.devices && userData.devices.length > 0) {
            userData.devices.map(async device => {
                const deviceImageName = device.general.imageName ? device.general.imageName : 'default_device_image.jpg';

                device['imageUrl'] = await firebase.storage().ref().child(`deviceImages/${deviceImageName}`).getDownloadURL();
            });
        }
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
                                <UserDevice key={index} deviceDetails={device} />
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

export default UserDeviceList;