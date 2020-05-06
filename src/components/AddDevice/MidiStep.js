import React from 'react';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import { addDeviceFormValues, currentStep } from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import StepNavigationButton from './StepNavigationButton';
import { AddDeviceFormStyles, CustomToggleSwitch } from '../../styles/components';

const Styles = styled.div`
    width: 90%;
    height: 90%;
    margin: auto;
    display: flex;
    align-items: center;
`;


const MidiStep = () => {

    const dispatch = useDispatch();
    const { handleSubmit, register } = useForm();
    const formFieldValues = useSelector(state => state.addDeviceFormValues);
    const stepNumber = useSelector(state => state.currentStep);

    const submitStep = async data => {
        const updatedData = formFieldValues;
        updatedData['midi'] = {};

        Object.keys(data).forEach(midiType => {
            updatedData['midi'][midiType] = {};
            updatedData['midi'][midiType]['enabled'] = data[midiType];
        });

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
                    <form name='midiForm' onSubmit={handleSubmit(submitStep)} className='form' autoComplete="off">
                        <div className='formFieldsContainer'>
                            <StepNavigationButton iconname='arrow-circle-left' />
                            <div className='fieldContainer'>
                                <CustomToggleSwitch>
                                    <label className="switch">
                                        Midi Out
                                        <input defaultChecked={false} name='midi_out' type="checkbox" ref={register()}></input>
                                        <span className="slider round"></span>
                                    </label>
                                </CustomToggleSwitch>
                                <CustomToggleSwitch>
                                    <label className="switch">
                                        Midi In
                                        <input defaultChecked={false} name='midi_in' type="checkbox" ref={register()}></input>
                                        <span className="slider round"></span>
                                    </label>
                                </CustomToggleSwitch>
                                <CustomToggleSwitch>
                                    <label className="switch">
                                        Midi Thru
                                        <input defaultChecked={false} name='midi_thru' type="checkbox" ref={register()}></input>
                                        <span className="slider round"></span>
                                    </label>
                                </CustomToggleSwitch>
                            </div>
                            <StepNavigationButton next iconname='arrow-circle-right' />
                        </div>
                    </form>
                </div>
            </AddDeviceFormStyles>
        </Styles>
    )
}

export default MidiStep;