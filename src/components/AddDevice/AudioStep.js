import React from 'react';
import styled from 'styled-components';
import { useForm, useFieldArray } from "react-hook-form";
import { addDeviceFormValues, currentStep } from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import StepNavigationButton from './StepNavigationButton';
import { AddDeviceFormStyles } from '../../styles/components';
import { CustomButtonStyles } from '../../styles/components';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Colors from '../../styles/colors';

const Styles = styled.div`
    width: 90%;
    height: 90%;
    margin: auto;
    display: flex;
    align-items: center;
    padding-top: 50px;

    .addAudioContainer {
        display: flex;
        width: 100%;
        justify-content: space-around;

        .addAudioSection {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 250px;

            .inputListTitle {
                font-weight: bold;
            }

            .fieldList {
                list-style: none;
                margin: 10px;
                padding: 0;

                li {
                    display: flex;
                    align-items: center;

                    .deleteButton {
                        position: relative;
                        height: 42px;
                        border-radius: 0 10px 10px 0;
                        border: none;
                        outline: none;
                        text-align: right;
                        font-size: 16px;
                        transition:0.2s;
                        -webkit-transition:0.2s;
                        -moz-transition:0.2s;
                        right: 22px;

                        &:hover {
                            background-color: ${Colors.middleGray};
                            color: ${Colors.whiteBlue};
                        }
                    }
                }
            }

            .inputContainer {
                flex-direction: row !important;
                position: relative;
                width: 250px !important;
            }

            .addButton {
                border-radius: 25px;
                padding: 10px;
                height: 25px;
                cursor: pointer;
                transition:0.2s;
                -webkit-transition:0.2s;
                -moz-transition:0.2s;

                .svg {
                    font-size: 25px;
                }

                &:hover {
                    transform: scale(1.2);
                }
            }

            .inputField {
                width: 100% !important;
            }
        }
    }
`;


const AudioStep = () => {

    library.add(faPlus);
    const dispatch = useDispatch();
    const { handleSubmit, register, control } = useForm();
    const formFieldValues = useSelector(state => state.addDeviceFormValues);
    const stepNumber = useSelector(state => state.currentStep);
    const audioOutLabel = 'output';
    const audioInLabel = 'input';

    const submitStep = async data => {
        const updatedData = formFieldValues;
        updatedData['Audio'] = data;

        dispatch(addDeviceFormValues(updatedData));

        nextStep();
    }

    const nextStep = () => {
        dispatch(currentStep(stepNumber + 1));
    }

    const AudioFields = props => {
        const { fields, append, remove } = useFieldArray({
            control,
            name: props.fieldname,
        });

        return (
            <div className='addAudioSection'>
                {fields.length > 0 ?
                    < div className='inputListTitle'>Audio {
                        props.fieldname === 'audioOut' ? audioOutLabel : audioInLabel
                    }s</div> : null
                }
                <ul className='fieldList'>
                    {fields.map((item, index) => (
                        <li className='inputListItem' key={item.id}>
                            <div className='inputContainer' >
                                <input placeholder={`${
                                    props.fieldname === 'audioOut' ? audioOutLabel : audioInLabel
                                    } name`} name={`${props.fieldname}[${index}]`} defaultValue={item.name} className='inputField' ref={register()} />
                            </div>
                            <button className='deleteButton' type='button' onClick={() => remove(index)}>X</button>
                        </li>
                    ))}
                </ul>
                {fields.length > 0 ?
                    <div onClick={() => append({ name: "" })} className='addButton'>
                        <FontAwesomeIcon className='svg' icon="plus" />
                    </div> :
                    <CustomButtonStyles>
                        <button onClick={() => append({ name: "" })} type='button' className='customButton'>Add audio {
                            props.fieldname === 'audioOut' ? audioOutLabel : audioInLabel
                        }s</button>
                    </CustomButtonStyles>
                }
            </div>
        )
    }

    AudioFields.propTypes = {
        fieldname: PropTypes.string
    }

    return (
        <Styles>
            <AddDeviceFormStyles>
                <div className='formContainer'>
                    <form name='audioForm' onSubmit={handleSubmit(submitStep)} className='form' autoComplete="off">
                        <div className='formFieldsContainer'>
                            <StepNavigationButton iconname='arrow-circle-left' />
                            <div className='fieldContainer'>
                                <div className='addAudioContainer'>
                                    <AudioFields fieldname='audioOut' />
                                    <AudioFields fieldname='audioIn' />
                                </div>
                            </div>
                            <StepNavigationButton next audioStep iconname='arrow-circle-right' />
                        </div>
                    </form>
                </div>
            </AddDeviceFormStyles>
        </Styles>
    )
}

export default AudioStep;