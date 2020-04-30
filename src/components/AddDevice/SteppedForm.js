import React from 'react';
import styled from 'styled-components';
import StepIndicator from './StepIndicator';
import GeneralStep from './GeneralStep';
import AudioStep from './AudioStep';
import MidiStep from './MidiStep';
import { useSelector } from 'react-redux';

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

            .formStep {
                display: none;
                height: 100%;
            }

            .currentStep {
                display: block;
            }
        }

        .stepIndicator {
            width: 100%;
            height: 50px;
        }
    }
`;

const SteppedForm = () => {
    const currentStep = useSelector(state => state.currentStep);

    const steps = [
        'General',
        'Audio',
        'Midi'
    ]

    return (
        <Styles>
            <div className='formAndIndicator'>
                <div className='formContainer'>
                    <div className={`formStep ${currentStep === 1 ? 'currentStep' : ''}`}>
                        <GeneralStep />
                    </div>
                    <div className={`formStep ${currentStep === 2 ? 'currentStep' : ''}`}>
                        <AudioStep />
                    </div>
                    <div className={`formStep ${currentStep === 3 ? 'currentStep' : ''}`}>
                        <MidiStep />
                    </div>
                </div>
                <div className='stepIndicator'>
                    <StepIndicator steps={steps} currentstep={currentStep} />
                </div>
            </div>
        </Styles>
    )
}

export default SteppedForm;