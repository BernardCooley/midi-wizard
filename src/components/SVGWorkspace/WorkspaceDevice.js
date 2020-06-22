import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Text, Group, Image, Rect } from 'react-konva';
import firebase from 'firebase';
import sweetAlert from 'sweetalert2';
import Colors from '../../styles/colors';


const WorkspaceDevice = props => {
    const db = firebase.firestore();
    const usersRef = db.collection('Users');
    const imageStorageRef = firebase.storage().ref();
    const [imageElement, setImageElement] = useState(0);
    const [deviceOpacity, setDeviceOpacity] = useState(1);
    const [optionsVisibility, setOptionsVisibility] = useState(false);

    useEffect(() => {
        getImageUrl(props.device.general.imageName);
    }, []);

    useEffect(() => {
        setDeviceOpacity(1);
        setOptionsVisibility(false);
    }, [props.clearselection]);

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
                fill={Colors.middleGray}
                offsetY={props.offset}
                stroke={Colors.whiteBlue}
                strokeWidth={1}
            />
        )
    }
    OptionButton.propTypes = {
        offset: PropTypes.number
    }

    const DeviceText = props => {
        return (
            <Text
                text={props.buttonname}
                fontSize={15}
                align={'center'}
                verticalAlign={'middle'}
                width={100}
                height={100}
                fill={Colors.whiteBlue}
                offsetY={props.offset}
                wrap={'word'}
            />
        )
    }
    DeviceText.propTypes = {
        offset: PropTypes.number,
        buttonname: PropTypes.string,
    }

    const DeviceImage = props => {
        return (
            <Image
                image={props.image}
                width={100}
                height={100}
                opacity={props.opacity}
            />
        )
    }
    DeviceImage.propTypes = {
        image: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
        ]),
        opacity: PropTypes.number,
    }

    return (
        <Group
            draggable={true}
            x={Math.round(props.device.position.x / 50) * 50}
            y={Math.round(props.device.position.y / 50) * 50}
            width={100}
            height={100}
            onDragStart={e => {
                const container = e.target.getStage().container();
                container.style.cursor = 'grabbing';
            }}
            onDragEnd={e => {
                updatePosition(props.device, Math.round(e.currentTarget.attrs.x / 50) * 50, Math.round(e.currentTarget.attrs.y / 50) * 50);
                const container = e.target.getStage().container();
                container.style.cursor = 'pointer';
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
                setDeviceOpacity(0.3);
                setOptionsVisibility(true);
                console.log(e.currentTarget.attrs.x, e.currentTarget.attrs.y);
            }}>
            <DeviceImage image={imageElement} opacity={deviceOpacity}></DeviceImage>
            <DeviceText buttonname={props.device.general.deviceName} offset={-65}></DeviceText>
            <Group
                visible={optionsVisibility}
                opacity={0.6}
                cursor={'pointer'}>
                <OptionButton offset={0}></OptionButton>
                <DeviceText buttonname='Midi' offset={33}></DeviceText>
                <OptionButton offset={-33}></OptionButton>
                <DeviceText buttonname='Audio' offset={0}></DeviceText>
                <OptionButton offset={-66}></OptionButton>
                <DeviceText buttonname='USB' offset={-33}></DeviceText>
            </Group>
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