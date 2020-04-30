import React, { useState } from 'react';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowCircleRight, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import StepIndicator from './StepIndicator';

const Styles = styled.div`
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: space-between;

    .stepNavigation {
        height: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .disabled {
            opacity: 0.5;
            pointer-events: none;
        }

        .navigationButtonContainer {
            height: auto;
            width: auto;
            transition:0.2s;
            -webkit-transition:0.2s;
            -moz-transition:0.2s;

            &:hover {
                transform: scale(1.3);
            }

            svg {
                font-size: 35px;
                color: ${Colors.darkTeal};
                pointer-events: none;
            }
        }
    }

    .formAndIndicator {
        height: 100%;
        display: flex;
        flex-direction: column;
        width: 85%;

        .formContainer {
            width: 100%;
            height: 85%;
        }

        .stepIndicator {
            width: 100%;
            height: 50px;
        }
    }
`;

const SteppedForm = () => {
    library.add(faArrowCircleRight, faArrowCircleLeft);
    const [currentStep, setCurrentStep] = useState(1);

    const steps = [
        'General',
        'Audio',
        'Midi'
    ]


    const previousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    }

    return (
        <Styles>
            <div className='back stepNavigation'>
                <div className={`navigationButtonContainer ${currentStep === 1 ? 'disabled' : ''}`} onClick={previousStep}>
                    <FontAwesomeIcon className='backButton' icon="arrow-circle-left" />
                </div>
            </div>
            <div className='formAndIndicator'>
                <div className='formContainer'>
                    {steps[currentStep - 1]}
                </div>
                <div className='stepIndicator'>
                    <StepIndicator steps={steps} currentstep={currentStep} />
                </div>
            </div>
            <div className='next stepNavigation'>
                <div className={`navigationButtonContainer ${currentStep === steps.length ? 'disabled' : ''}`} onClick={nextStep}>
                    <FontAwesomeIcon className='nextButton' icon="arrow-circle-right" />
                </div>
            </div>
        </Styles>
    )
}

export default SteppedForm;