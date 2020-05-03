import React from 'react';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faDotCircle } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';
import { currentStep } from '../../actions';
import { useDispatch } from 'react-redux';


const Styles = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: baseline;

    .stepConnector {
        border-bottom: 3px solid ${Colors.lightGray};
        position: relative;
        bottom: 6px;
        width: 30%;

        &:last-of-type {
            display: none;
        }
    }

    .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 120px;
        cursor: pointer;
        transition:0.2s;
        -webkit-transition:0.2s;
        -moz-transition:0.2s;

        &:hover {
            transform: scale(1.2);
            color: ${Colors.darkTeal};
        }

        .stepIcon {
            color: ${Colors.lightGray};
            pointer-events: none;
        }

        .activeStep {
            transform: scale(1.3);
            color: ${Colors.darkTeal};
        }

        .completedStep {
            transform: scale(1.3);
            color: ${Colors.brightGreen};
        }

        .stepName {
            pointer-events: none;
        }

        .activeStepName {
            font-weight: bold;
        }
    }
`;

const StepIndicator = props => {
    library.add(faDotCircle);
    const progress = props.progress;

    const dispatch = useDispatch();

    const changeStep = e => {
        dispatch(currentStep(parseInt(e.target.getAttribute('stepnumber')) + 1));
    }

    const Step = props => {
        return (
            <div onClick={props.stepnumber < progress ? changeStep : null} stepnumber={props.stepnumber} className='step'>
                <FontAwesomeIcon icon="dot-circle" className={`stepIcon ${props.stepnumber < progress - 1 && !props.activestep ? 'completedStep' : ''} ${props.activestep ? 'activeStep' : ''}`} />
                <div className={`stepName ${props.activestep ? 'activeStepName' : ''}`}>{props.stepname}</div>
            </div>
        )
    }

    Step.propTypes = {
        stepname: PropTypes.string,
        stepnumber: PropTypes.number,
        activestep: PropTypes.bool
    }

    return (
        <Styles>
            {props.steps.map((step, index) => (
                <>
                    <Step stepnumber={props.steps.indexOf(step)} key={index} stepname={step} activestep={props.steps.indexOf(step) === props.currentstep - 1} />
                    <div className='stepConnector'></div>
                </>
            ))}
        </Styles>
    )
}

StepIndicator.propTypes = {
    steps: PropTypes.array,
    currentstep: PropTypes.number,
    progress: PropTypes.number
}

export default StepIndicator;