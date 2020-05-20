import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import firebase from '../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { toggleEditingImage, gettingData } from '../../actions';
import Colors from '../../styles/colors';
import sweetAlert from 'sweetalert';

const Styles = styled.div`
    .changeImageContainer {
        position: absolute;
        top: 50%;
        left: 50%;
        height: auto;
        width: 500px;
        transform: translate(-50%, -50%);
        background-color: ${Colors.red};
        display: flex;
        flex-direction: column;
        padding: 20px;
        align-items: center;
        background-color: ${Colors.middleGray};
        -webkit-box-shadow: 4px 4px 5px 0px rgba(0,0,0,0.75);
        -moz-box-shadow: 4px 4px 5px 0px rgba(0,0,0,0.75);
        box-shadow: 4px 4px 5px 0px rgba(0,0,0,0.75);

        .closeButton {
            position: absolute;
            right: 3px;
            top: 3px;
        }

        .manualAddDeviceForm {
            width: 100%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;

            .imageUploadInput {
                font-size: 16px;
                cursor:pointer;
            }
        }

        .previewImage {
            width: 80%;
            margin: 15px;
        }
    }
`

const ChangeImage = () => {

    const db = firebase.firestore();
    const stockDeviceDtaRef = db.collection('DeviceData');

    const dispatch = useDispatch();
    const imageStorageRef = firebase.storage().ref();
    const [imageFieldPopulated, setImageFieldPopulated] = useState(false);
    const [filePath, setFilePath] = useState('');
    const { handleSubmit, register } = useForm();
    const idBeingEdited = useSelector(state => state.deviceIdBeingEdited);
    const allStockDevices = useSelector(state => state.allStockDevices);

    const closeForm = () => {
        document.querySelector('#imageUploadInput').value = '';
        setImageFieldPopulated(false);
        setFilePath('');
        dispatch(toggleEditingImage(false));
    }

    const updateImage = async data => {
        const formData = data;
        const imageName = formData.imageFile[0].name;

        if (!doesImageExist(imageName)) {
            dispatch(toggleEditingImage(false));
            dispatch(gettingData(true));
            const existingImageName = allStockDevices.filter(device => device.deviceId === idBeingEdited)[0].imageName;

            uploadImage(formData.imageFile[0]).then(snapshot => {
                snapshot.ref.getDownloadURL().then(downloadURL => {
                    deleteExistingImage(existingImageName).then(() => {
                        updateDeviceDetails(imageName, downloadURL).then(() => {
                            sweetAlert({
                                title: 'Success',
                                text: 'Image uploaded',
                                icon: 'success',
                                buttons: false,
                                timer: 2000,
                                className: ''
                            });
                            dispatch(gettingData(false));
                        });
                    });
                });
            });
        } else {
            sweetAlert({
                title: 'Success',
                text: 'Image already uploaded. Please choose another.',
                icon: 'success',
                buttons: false,
                timer: 2000,
                className: ''
            });
        }
    }

    const doesImageExist = imageName => {
        const allImageNames = allStockDevices.map(device => {
            return device.imageName
        });
        return allImageNames.includes(imageName);
    }

    const setPreview = data => {
        setFilePath(URL.createObjectURL(data.imageFile[0]));
    }

    const onChangeHandler = data => {
        setImageFieldPopulated(true);
        setPreview(data);
    }

    const uploadImage = async imageFile => {
        const imageUpload = await imageStorageRef.child('deviceImages').child(imageFile.name);

        return await imageUpload.put(imageFile);
    }

    const updateDeviceDetails = async (imageName, imageUrl) => {
        return await stockDeviceDtaRef.doc(idBeingEdited).update({
            'imageName': imageName,
            'imageUrl': imageUrl
        });
    }

    const deleteExistingImage = async existingImageName => {
        return await imageStorageRef.child(`deviceImages/${existingImageName}`).delete();
    }

    return (
        <Styles>
            <div className='changeImageContainer'>
                <button className='closeButton' onClick={closeForm}>X</button>
                <form onSubmit={handleSubmit(updateImage)} className='manualAddDeviceForm' autoComplete="off">
                    <input onChange={handleSubmit(onChangeHandler)} id='imageUploadInput' className='imageUploadInput' name="imageFile" ref={register({
                        validate: files => files.length === 0 || files[0].name.includes('.jpg') || files[0].name.includes('.png') || files[0].name.includes('.jpeg')
                    })} type="file" />
                    <img className='previewImage' src={filePath ? filePath : ''} />
                    {imageFieldPopulated ?
                        <button type='submit' className='submitButton'>Update image</button>
                        : null
                    }
                </form>
            </div>
        </Styles>
    )
}

export default ChangeImage;