import React from 'react';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import { addDeviceFormValues, currentStep } from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import StepNavigationButton from './StepNavigationButton';
import { AddDeviceFormStyles } from '../../styles/components';

const Styles = styled.div`
    width: 90%;
    height: 90%;
    margin: auto;
    display: flex;
    align-items: center;
`;


const GeneralStep = () => {

    const dispatch = useDispatch();
    const { handleSubmit, register, errors } = useForm();
    const formFieldValues = useSelector(state => state.addDeviceFormValues);
    const stepNumber = useSelector(state => state.currentStep);

    const submitStep = async data => {
        const updatedData = formFieldValues;
        updatedData['General'] = data;

        dispatch(addDeviceFormValues(updatedData));
        nextStep();
    }

    const nextStep = () => {
        dispatch(currentStep(stepNumber + 1));
    }

    return (
        <Styles>
            <AddDeviceFormStyles>
                <div className='formContainer'>
                    <div className='skip'></div>
                    <form name='generalForm' onSubmit={handleSubmit(submitStep)} className='form' autoComplete="off">
                        <div className='formFieldsContainer'>
                            <div className='navPlaceholder'></div>
                            <div className='fieldContainer'>
                                <div className='inputContainer'>
                                    <div className='validationContainer'>{errors.deviceName && errors.deviceName.message}</div>
                                    <input className={`inputField ${errors.deviceName ? 'errorBox' : ''}`} placeholder='Device name' name="deviceName" ref={register({
                                        required: 'Please enter device name'
                                    })} />
                                </div>

                                <div className='inputContainer'>
                                    <div className='validationContainer'>{errors.manufacturer && errors.manufacturer.message}</div>
                                    <input className={`inputField ${errors.manufacturer ? 'errorBox' : ''}`} placeholder='Manufacturer' name="manufacturer" ref={register({
                                        required: 'Please enter manufacturer'
                                    })} />
                                </div>
                            </div>
                            <StepNavigationButton next iconname='arrow-circle-right' />
                        </div>
                    </form>
                </div>
            </AddDeviceFormStyles>
        </Styles>
    )
}

export default GeneralStep;