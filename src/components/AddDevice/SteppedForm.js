import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StepIndicator from './StepIndicator';
import GeneralStep from './GeneralStep';
import AudioStep from './AudioStep';
import MidiStep from './MidiStep';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../styles/colors';
import ConfirmStep from './ConfirmStep';
import { addDeviceFormValues, currentStep } from '../../actions';

const Styles = styled.div`
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: space-between;

    .formAndIndicator {
        height: 100%;
        display: flex;
        flex-direction: column;
        width: 100%;

        .formContainer {
            width: 100%;
            height: 85%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;

            .skip {
                cursor: pointer;
                font-weight: bold;
                color: ${Colors.middleGray};
                width: 100%;
                text-align: right;
                position: relative;
                height: 25px;
                top: 10px;

                &:hover {
                    text-decoration: underline;
                    color: ${Colors.darkTeal};
                }
            }

            .formStep {
                display: none;
                height: 100%;
                width: 100%;
                position: absolute;
                z-index: -10;
                flex-direction: column;
            }

            .currentStep {
                display: flex;
                position: relative;
                z-index: 10;
            }
        }

        .stepIndicator {
            width: 100%;
            height: 50px;
            border-bottom: 1px solid ${Colors.lightGray}
        }
    }
`;

const SteppedForm = () => {
    const dispatch = useDispatch();
    const currStep = useSelector(state => state.currentStep);
    const formFieldValues = useSelector(state => state.addDeviceFormValues);
    const stepNumber = useSelector(state => state.currentStep);
    const [progress, setProgress] = useState(1);

    useEffect(() => {
        if (progress < currStep) {
            setProgress(currStep);
        }
    }, [currStep]);

    const steps = [
        'General',
        'Audio',
        'Midi',
        'Confirm'
    ]

    const skipStep = () => {
        let stepName = '';
        if (currStep === 2) {
            stepName = 'Audio';
        } else if (currStep === 3) {
            stepName = 'Midi';
        }

        const updatedData = formFieldValues;
        updatedData[stepName] = null;

        dispatch(addDeviceFormValues(updatedData));
        dispatch(currentStep(stepNumber + 1));
    }

    return (
        <Styles>
            <div className='formAndIndicator'>
                <div className='stepIndicator'>
                    <StepIndicator progress={progress} steps={steps} currentstep={currStep} />
                </div>
                <div className='formContainer'>
                    <div className={`formStep ${currStep === 1 ? 'currentStep' : ''}`}>
                        <GeneralStep />
                    </div>
                    <div className={`formStep ${currStep === 2 ? 'currentStep' : ''}`}>
                        <div className='skip' onClick={skipStep}>Skip step</div>
                        <AudioStep />
                    </div>
                    <div className={`formStep ${currStep === 3 ? 'currentStep' : ''}`}>
                        <div className='skip' onClick={skipStep}>Skip step</div>
                        <MidiStep />
                    </div>
                    <div className={`formStep ${currStep === 4 ? 'currentStep' : ''}`}>
                        <ConfirmStep />
                    </div>
                </div>
            </div>
        </Styles>
    )
}

export default SteppedForm;