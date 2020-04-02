import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import firebase from '../../firebase';

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
    const imageStorageRef = firebase.storage().ref();
    const [imageFieldPopulated, setImageFieldPopulated] = useState(false);
    const [filePath, setFilePath] = useState('');
    const { handleSubmit, register, errors } = useForm();

    const clearFileInput = () => {
        document.querySelector('#imageUploadInput').value = '';
        setImageFieldPopulated(false);
        setFilePath('');
    }

    const updateImage = async data => {
        const formData = data;

        console.log(formData.imageFile[0]);

        const imageName = formData.imageFile[0].name;

        // uploadImage(formData.imageFile[0]).then(() => {
        //     updateDeviceDetails().then(() => {
        //         deleteExistingImage();
        //     })
        // })
    }

    const setPreview = data => {
        setFilePath(URL.createObjectURL(data.imageFile[0]));
    }

    const onChangeHandler = data => {
        setImageFieldPopulated(true);
        setPreview(data);
    }

    const uploadImage = async imageFile => {
        let imageUpload = await imageStorageRef.child('deviceImages').child(imageFile.name)

        return await imageUpload.put(imageFile);
    }

    const updateDeviceDetails = async deviceId => {

        return await stockDeviceDtaRef.doc(deviceId).update({

        });
    }

    const deleteExistingImage = async () => {

    }

    return (
        <Styles>
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