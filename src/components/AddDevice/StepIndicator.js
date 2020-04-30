import React from 'react';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faDotCircle } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';


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

        .stepIcon {
            color: ${Colors.lightGray};
            pointer-events: none;
        }

        .activeStep {
            transform: scale(1.3);
            color: ${Colors.darkTeal};
        }

        .activeStepName {
            font-weight: bold;
        }
    }
`;

const StepIndicator = props => {
    library.add(faDotCircle);

    const Step = props => {
        return (
            <div className='step'>
                <FontAwesomeIcon icon="dot-circle" className={`stepIcon ${props.activestep ? 'activeStep' : ''}`} />
                <div className={`stepName ${props.activestep ? 'activeStepName' : ''}`}>{props.stepname}</div>
            </div>
        )
    }

    Step.propTypes = {
        stepname: PropTypes.string,
        activestep: PropTypes.bool
    }

    return (
        <Styles>
            {props.steps.map((step, index) => (
                <>
                    <Step key={index} stepname={step} activestep={props.steps.indexOf(step) === props.currentstep - 1} />
                    <div className='stepConnector'></div>
                </>
            ))}
        </Styles>
    )
}

StepIndicator.propTypes = {
    steps: PropTypes.array,
    currentstep: PropTypes.number
}

export default StepIndicator;