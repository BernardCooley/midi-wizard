import React, { useEffect } from 'react';
import UserDevice from '../UserDevice/UserDevice';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toggleAddDeviceForm, isDeviceTrayOpen } from '../../actions';
import firebase from 'firebase';
import styled from 'styled-components';


const Styles = styled.div`
    .deviceTrayContainer {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            scrollbar-color: red;
            position: fixed;
            bottom: -50px;
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
            color: white;

            .openCloseButton {
                position: relative;
                top: -29px;
                background-color: #383838;
                height: 30px;
                border: none;
                width: 120px;
                font-size: 20px;
                outline: none;
                border-radius: 5px 5px 0 0;
                cursor: pointer;
                color: white;

                &.open:hover {
                    background-color: white;
                    color: #383838;
                }
            }

            .deviceListInnerContainer {
                display: flex;
                align-items: center;
                width: 98%;
                position: relative;
                top: -35px;

                .listContainer {
                    display: flex;
                    align-items: center;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    margin: auto;
                    overflow-y: auto;
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
                bottom: -253px;
            }
`

const UserDeviceList = () => {

    library.add(faPlus);
    const dispatch = useDispatch();
    const userDevices = useSelector(state => state.userDevices);
    const isAddDeviceFormOpen = useSelector(state => state.isAddDeviceFormOpen);
    const deviceTrayOpen = useSelector(state => state.isDeviceTrayOpen);

    useEffect(() => {
        getImageUrls();
    }, [userDevices]);

    const toggleDeviceTray = () => {
        dispatch(isDeviceTrayOpen());
        dispatch(toggleAddDeviceForm(false));
    }

    const getImageUrls = async () => {
        userDevices.map(async device => {
            const deviceImageName = device.imageName ? device.imageName : 'default_device_image.jpg';

            device['imageUrl'] = await firebase.storage().ref().child(`deviceImages/${deviceImageName}`).getDownloadURL();
        });
    }

    return (
        <Styles>
            <div className={`deviceTrayContainer ${!deviceTrayOpen ? 'closed' : ''}`}>
                <div className='devicesListContainer'>
                    <button onClick={toggleDeviceTray} className={`openCloseButton ${!deviceTrayOpen ? 'open' : ''}`}>Devices</button>
                    <div className='deviceListInnerContainer'>
                        <div className='listContainer'>
                            {userDevices.length > 0 ? userDevices.map((device, index) => (
                                <UserDevice key={index} deviceDetails={device}/>
                            )):null}
                        </div>
                        {!isAddDeviceFormOpen ? 
                            <div className={`openAddDeviceFormButton ${deviceTrayOpen ? 'trayOpen': ''}`} onClick={() => dispatch(toggleAddDeviceForm(true))}>
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