import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Text, Group, Image } from 'react-konva';
import firebase from 'firebase';
import sweetAlert from 'sweetalert2';


const WorkspaceDevice = props => {
    const db = firebase.firestore();
    const usersRef = db.collection('Users');
    const imageStorageRef = firebase.storage().ref();
    const [imageObject, setImageObject] = useState(0);

    useEffect(() => {
        getImageUrl(props.device.general.imageName);
    }, []);

    const getImageUrl = async imageName => {
        const imageResponse = imageStorageRef.child(`deviceImages/${imageName}`);

        return await imageResponse.getDownloadURL().then(url => {
            const image = new window.Image();
            image.src = url;
            image.onload = () => {
                setImageObject(image);
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

    return (
        <Group
            draggable={true}
            x={props.device.position.x}
            y={props.device.position.y}
            width={100}
            height={100}
            onDragEnd={(data) => {
                updatePosition(props.device, data.currentTarget.attrs.x, data.currentTarget.attrs.y);
            }}>
            <Image
                image={imageObject}
                width={100}
                height={100}
            />
            <Text
                text={props.device.general.deviceName}
                fontSize={15}
                align={'center'}
                verticalAlign={'middle'}
                wrap={'word'}
                width={100}
                height={100} />
        </Group>
    )

}

WorkspaceDevice.propTypes = {
    device: PropTypes.object,
    userid: PropTypes.string,
    userlayouts: PropTypes.object
}

export default WorkspaceDevice;