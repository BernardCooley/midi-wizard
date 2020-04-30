import React from 'react';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowCircleRight, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { addDeviceFormValues, currentStep } from '../../actions';
import { useSelector, useDispatch } from 'react-redux';

const Styles = styled.div`
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 35px;

    .navigationButtonContainer {
        height: auto;
        width: auto;
        transition:0.2s;
        -webkit-transition:0.2s;
        -moz-transition:0.2s;
        background: transparent;
        border: none;

        &:hover {
            transform: scale(1.3);
        }

        svg {
            font-size: 35px;
            color: ${Colors.darkTeal};
            pointer-events: none;
        }
    }
`;


const StepNavigationButton = props => {

    const dispatch = useDispatch();
    library.add(faArrowCircleRight, faArrowCircleLeft);
    const stepNumber = useSelector(state => state.currentStep);

    const previousStep = () => {
        dispatch(currentStep(stepNumber - 1));
    }

    return (
        <Styles>
            <button onClick={!props.next ? previousStep : null} type={props.next ? 'submit' : 'button'} className='navigationButtonContainer'>
                <FontAwesomeIcon icon={props.iconname} />
            </button>
        </Styles>
    )
}

StepNavigationButton.propTypes = {
    iconname: PropTypes.string,
    next: PropTypes.bool
}

export default StepNavigationButton;