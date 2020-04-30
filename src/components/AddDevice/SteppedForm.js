import React from 'react';
import styled from 'styled-components';
import StepIndicator from './StepIndicator';
import GeneralStep from './GeneralStep';
import AudioStep from './AudioStep';
import MidiStep from './MidiStep';
import { useSelector } from 'react-redux';
import Colors from '../../styles/colors';
import ConfirmStep from './ConfirmStep';

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

            .formStep {
                display: none;
                height: 100%;
                width: 100%;
            }

            .currentStep {
                display: block;
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
    const currentStep = useSelector(state => state.currentStep);

    const steps = [
        'General',
        'Audio',
        'Midi',
        'Confirm'
    ]

    return (
        <Styles>
            <div className='formAndIndicator'>
                <div className='stepIndicator'>
                    <StepIndicator steps={steps} currentstep={currentStep} />
                </div>
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
                    <div className={`formStep ${currentStep === 4 ? 'currentStep' : ''}`}>
                        <ConfirmStep />
                    </div>
                </div>
            </div>
        </Styles>
    )
}

export default SteppedForm;