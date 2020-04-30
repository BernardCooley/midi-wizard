import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { CustomButtonStyles } from '../../styles/components';
import Colors from '../../styles/colors';
import StepNavigationButton from './StepNavigationButton';

const Styles = styled.div`
    width: 90%;
    height: 90%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .customButton {
        margin-top: 50px;
    }

    .summaryContainer {
        display: flex;
        height: 100%;
        height: 100%;
        width: 100%;
        margin: auto;
        justify-content: space-between;
        padding-top: 20px;
        
        .summarySection {
            height: 100%;
            flex-grow: 1;
            margin: 10px;
            display: flex;
            justify-content: center;
            -webkit-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
            -moz-box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
            box-shadow: 0 0 3pt 2pt ${Colors.lightGray};
            flex-direction: column;
            align-items: center;

            .summarySectionTitle {
                position: relative;
                top: -17px;
                background-color: #f3f7ff;
                padding: 5px;
            }

            .summaryDetails {
                width: 100%;
                height: 100%;
            }
        }
    }
`;


const ConfirmStep = () => {

    const dispatch = useDispatch();
    const formFieldValues = useSelector(state => state.addDeviceFormValues);

    const addDevice = async () => {
        console.log(formFieldValues);
    }

    return (
        <Styles>
            <div className='summaryContainer'>
                <StepNavigationButton iconname='arrow-circle-left' />
                <div className='summarySection'>
                    <div className='summarySectionTitle'>General</div>
                    <div className='summaryDetails'>

                    </div>
                </div>
                <div className='summarySection'>
                    <div className='summarySectionTitle'>Audio</div>
                    <div className='summaryDetails'>

                    </div>
                </div>
                <div className='summarySection'>
                    <div className='summarySectionTitle'>Midi</div>
                    <div className='summaryDetails'>

                    </div>
                </div>
            </div>
            <CustomButtonStyles>
                <button type='submit' onClick={addDevice} className='customButton'>Add device</button>
            </CustomButtonStyles>
        </Styles>
    )
}

export default ConfirmStep;