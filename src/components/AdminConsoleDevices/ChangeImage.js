import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import firebase from '../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { toggleEditingImage } from '../../actions';
import { ToastContainer, toast } from 'react-toastify';

const Styles = styled.div`
    .changeImageContainer {
        position: absolute;
        top: 50%;
        left: 50%;
        height: auto;
        width: 500px;
        transform: translate(-50%, -50%);
        background-color: red;
    }

    img {
        width: 80%;
        margin: auto;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, 0);
    }

`

const ChangeImage = () => {

    const db = firebase.firestore();
    const stockDeviceDtaRef = db.collection('DeviceData');

    const dispatch = useDispatch();
    const imageStorageRef = firebase.storage().ref();
    const [imageFieldPopulated, setImageFieldPopulated] = useState(false);
    const [filePath, setFilePath] = useState('');
    const { handleSubmit, register, errors } = useForm();
    const idBeingEdited = useSelector(state => state.deviceIdBeingEdited);
    const stockDevices = useSelector(state => state.stockDevices);

    const notify = message => {
        toast(message);
    };

    const clearFileInput = () => {
        document.querySelector('#imageUploadInput').value = '';
        setImageFieldPopulated(false);
        setFilePath('');
    }

    const updateImage = async data => {
        const formData = data;
        const imageName = formData.imageFile[0].name;
        const existingImageName = stockDevices.filter(device => device.deviceId === idBeingEdited)[0].imageName;

        uploadImage(formData.imageFile[0]).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
                deleteExistingImage(existingImageName).then(() => {
                    updateDeviceDetails(imageName, downloadURL).then(() => {
                        notify('Image uploaded');
                        dispatch(toggleEditingImage(false));
                    }); 
                });
            });
        })
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
            <ToastContainer />
            <div className='changeImageContainer'>
                <form onSubmit={handleSubmit(updateImage)} className='manualAddDeviceForm' autoComplete="off">
                    <input onChange={handleSubmit(onChangeHandler)} id='imageUploadInput' className='imageUploadInput' name="imageFile" ref={register({
                        validate: files => files.length === 0 || files[0].name.includes('.jpg') || files[0].name.includes('.png') || files[0].name.includes('.jpeg')
                    })} type="file" />
                    {imageFieldPopulated ?
                        <div>
                            <button onClick={clearFileInput} className='clearImageUploadField' type="button">X</button> 
                            <button type='submit' className='submitButton'>Update image</button>
                        </div>: null
                    }
                </form>
                <img className='previewImage' src={filePath ? filePath : ''}/>
            </div>
        </Styles>
    )
}

export default ChangeImage;