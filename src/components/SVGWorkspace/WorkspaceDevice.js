import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Text, Group, Image, Rect } from 'react-konva';
import firebase from 'firebase';
import sweetAlert from 'sweetalert2';
import Colors from '../../styles/colors';
import Konva from 'konva';
import { selectedWorkspaceDeviceId } from '../../actions';
import { useSelector, useDispatch } from 'react-redux';


const WorkspaceDevice = props => {
    const currentDevice = props.device;
    const db = firebase.firestore();
    const usersRef = db.collection('Users');
    const imageStorageRef = firebase.storage().ref();
    const [imageElement, setImageElement] = useState(0);
    const [imageShadowOffset, setImageShadowOffset] = useState({x: 5, y: 5});
    const [optionSelected, setOptionSelected] = useState('');
    const [optionHovered, setOptionHovered] = useState('');
    const dispatch = useDispatch();
    const selectedDeviceId = useSelector(state => state.selectedWorkspaceDeviceId);
    const scaleStage = useSelector(state => state.stageScale);

    useEffect(() => {
        getImageUrl(currentDevice.general.imageName);
    }, []);

    useEffect(() => {
        clearSelection();
    }, [props.clearselection]);

    const clearSelection = () => {
        dispatch(selectedWorkspaceDeviceId(''));
        setOptionSelected('');
    }

    const getImageUrl = async imageName => {
        const imageResponse = imageStorageRef.child(`deviceImages/${imageName}`);

        return await imageResponse.getDownloadURL().then(url => {
            const image = new window.Image();
            image.src = url;
            image.onload = () => {
                setImageElement(image);
            };
        });
    }

    const updatePosition = async (device, x, y) => {
        device.position.x = x;
        device.position.y = y;

        await usersRef.doc(props.userid).update({
            layouts: props.userlayouts
        }).then().catch(error => {
            sweetAlert.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! You may be disconnected from the internet. Please try again later.'
            });
            console.error(error);
        });
    }

    const OptionButton = props => {
        return (
            <Rect
                height={33}
                width={100}
                fill={optionHovered === props.buttonname ? Colors.darkTeal : Colors.middleGray}
                offsetY={props.offset}
                stroke={Colors.whiteBlue}
                strokeWidth={1}
            />
        )
    }
    OptionButton.propTypes = {
        offset: PropTypes.number,
        buttonname: PropTypes.string
    }

    const DeviceText = props => {
        return (
            <Text
                opacity={selectedDeviceId.length > 0 && selectedDeviceId !== currentDevice.deviceId ? 0.3 : 1}
                name={props.buttonname}
                text={props.buttonname}
                fontSize={16 / scaleStage}
                align={'center'}
                verticalAlign={'middle'}
                width={100}
                height={33}
                fill={Colors.white}
                offsetY={props.offset}
                wrap={'word'}
                onClick={e => {
                    setOptionSelected(e.target.name());
                }}
                onMouseOver={e => {
                    setOptionHovered(e.target.name());
                }}
            />
        )
    }
    DeviceText.propTypes = {
        offset: PropTypes.number,
        buttonname: PropTypes.string,
        opacity: PropTypes.number
    }

    const DeviceImage = props => {
        return (
            <Image
                name={'image'}
                image={props.image}
                width={100}
                height={100}
                opacity={selectedDeviceId.length > 0 ? 0.3 : 1}
                shadowColor={Colors.jet}
                shadowOffset={imageShadowOffset}
                shadowBlur={7}
            />
        )
    }
    DeviceImage.propTypes = {
        image: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
        ])
    }

    const getConnectionOptions = () => {
        const availableOptions = [];

        if (optionSelected === 'Midi') {
            if (currentDevice.midi.midi_in.enabled) {
                availableOptions.push('In');
            }
            if (currentDevice.midi.midi_out.enabled) {
                availableOptions.push('Out');
            }
            if (currentDevice.midi.midi_thru.enabled) {
                availableOptions.push('Thru');
            }
        } else if (optionSelected === 'Audio') {
            Object.keys(currentDevice.audio.audioIn).forEach(audio => {
                availableOptions.push(audio);
            });
            Object.keys(currentDevice.audio.audioOut).forEach(audio => {
                availableOptions.push(audio);
            });
        } else if (optionSelected === 'USB') {
            if (currentDevice.usb) {
                availableOptions.push('USB');
            }
        }
        return availableOptions;
    }

    const getConnectionTypes = () => {
        const connectionTypes = [];

        if (props.device.midi.midi_in.enabled || props.device.midi.midi_out.enabled || props.device.midi.midi_thru.enabled) {
            connectionTypes.push('Midi');
        }

        if (Object.keys(props.device.audio.audioIn).length > 0 || Object.keys(props.device.audio.audioOut).length > 0) {
            connectionTypes.push('Audio');
        }

        // if (props.device.usb.enabled) {
        //     connectionTypes.push('USB');
        // }

        return connectionTypes;
    }

    const ConnectionButtons = props => {
        const options = props.buttonset === 1 ? getConnectionTypes() : getConnectionOptions();

        return (
            <Group
                visible={selectedDeviceId === currentDevice.deviceId ? true : false}
                x={props.buttonset === 1 ? 0 : 100}
                y={0}
                width={100}
                height={33}
                cursor={'pointer'}>
                {options.map((option, index) => (
                    <Group key={index}>
                        <OptionButton buttonname={option} offset={index * -33}></OptionButton>
                        <DeviceText buttonname={option} offset={index * -33}></DeviceText>
                    </Group>
                ))}
            </Group>
        )
    }

    WorkspaceDevice.propTypes = {
        buttonset: PropTypes.number
    }

    return (
        <Group>
            {currentDevice.position ?
                <Group
                    draggable={true}
                    x={Math.round(currentDevice.position.x / 50) * 50}
                    y={Math.round(currentDevice.position.y / 50) * 50}
                    width={100}
                    height={100}
                    cursor={'pointer'}
                    onDragStart={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = 'grabbing';

                        e.target.to({
                            duration: 0.5,
                            easing: Konva.Easings.ElasticEaseOut,
                            scaleX: 1.2,
                            scaleY: 1.2
                        });

                        setImageShadowOffset({x: 15, y: 15});
                    }}
                    onDragEnd={e => {
                        updatePosition(currentDevice, Math.round(e.currentTarget.attrs.x / 50) * 50, Math.round(e.currentTarget.attrs.y / 50) * 50);
                        const container = e.target.getStage().container();
                        container.style.cursor = 'pointer';

                        e.target.to({
                            duration: 0.5,
                            easing: Konva.Easings.ElasticEaseOut,
                            scaleX: 1,
                            scaleY: 1
                        });

                        setImageShadowOffset({x: 5, y: 5});
                    }}
                    onMouseOver={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = 'pointer';
                    }}
                    onMouseLeave={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = 'default';
                    }}
                    onClick={e => {
                        dispatch(selectedWorkspaceDeviceId(currentDevice.deviceId));
                    }}>
                    <DeviceImage image={imageElement}></DeviceImage>
                    <DeviceText buttonname={currentDevice.general.deviceName} offset={-95}></DeviceText>
                    <ConnectionButtons buttonset={1} />
                    <ConnectionButtons buttonset={2} />
                </Group>
                : null}
        </Group>
    )

}

WorkspaceDevice.propTypes = {
    device: PropTypes.object,
    userid: PropTypes.string,
    userlayouts: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    clearselection: PropTypes.bool
}

export default WorkspaceDevice;