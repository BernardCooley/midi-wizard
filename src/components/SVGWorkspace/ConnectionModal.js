import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import firebase from '../../firebase';
import { CustomButton, ConnectionFormSection } from '../../styles/components';
import { selectedLayoutDeviceId } from '../../actions';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Colors from '../../styles/colors';
import DeviceDropdown from './DeviceDropdown';

const Styles = styled.div`
    .connectionModalContainer {
        height: auto;
        width: 80%;
        margin: auto;
        position: absolute;
        top: 100px;
        background-color: ${Colors.whiteBlue};
        left: 100px;
        padding: 20px 0;

        .formContainer {
            padding-bottom: 100px;
        }

        .connectionFormSection {
            width: 90%;
            margin: auto;
            height: auto;
            color: ${Colors.middleGray};
            border-bottom: 1px solid ${Colors.lightGray};

            .sectionFields {


                .fieldContainer {
                    height: 50px;
                    display: flex;
                    width: 60%;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 20px;
                    margin: auto;
                }
            }
        }

        .connectionEditButtons {
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            margin: auto;
            position: absolute;
            bottom: 20px;
        }
    }
`;

const ConnectionModal = props => {

    const dispatch = useDispatch();
    const { handleSubmit } = useForm();

    const closeModal = () => {
        dispatch(selectedLayoutDeviceId(''));
    }

    const saveConnections = async () => {
        const midiInSelection = getMidiSelection('in');
        const midiOutSelection = getMidiSelection('out');
        const midiThruSelection = getMidiSelection('thru');
        console.log(midiInSelection, midiOutSelection, midiThruSelection);
    }

    const getMidiSelection = inOutThru => {
        const midiDropdown = document.querySelector(`#midi${inOutThru}Dropdown`);
        var selection = midiDropdown.options[midiDropdown.selectedIndex].value;
        return selection;
    }

    return (
        <Styles>
            <div className='connectionModalContainer'>

                <form onSubmit={handleSubmit(saveConnections)} className="formContainer" noValidate>

                    <div className='connectionFormSection'>
                        <h2>Midi</h2>
                        <div className='sectionFields'>
                            <div className='fieldContainer'>
                                <div>In from: </div>
                                <DeviceDropdown midiType='in' deviceid={props.deviceid} />
                            </div>
                            <div className='fieldContainer'>
                                <div>Out to: </div>
                                <DeviceDropdown midiType='out' deviceid={props.deviceid} />
                            </div>
                            <div className='fieldContainer'>
                                <div>Thru to: </div>
                                <DeviceDropdown midiType='thru' deviceid={props.deviceid} />
                            </div>
                        </div>
                    </div>

                    <div className='connectionFormSection'>
                        <h2>Audio</h2>
                    </div>

                    <CustomButton>
                        <div className='connectionEditButtons'>
                            <button type='submit' className='customButton'>Save</button>
                            <button onClick={closeModal} className='customButton'>Cancel</button>
                        </div>
                    </CustomButton>
                </form>
            </div>
        </Styles>
    )
}

ConnectionModal.propTypes = {
    deviceid: PropTypes.string,
    devices: PropTypes.array
}

export default ConnectionModal;