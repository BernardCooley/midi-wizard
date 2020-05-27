import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAddDeviceForm, currentStep, addDeviceFormValues, deviceBeingEdited, triggerStockDeviceHook } from '../../actions';
import StockSearchResults from './StockSearchResults';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import styled from 'styled-components';
import { CloseIconStyles } from '../../styles/components';
import Colors from '../../styles/colors';
import SteppedForm from '../AddDevice/SteppedForm';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';


const Styles = styled.div`
    .addingDevice {
        opacity: 0;
    }

    .addDeviceOuterContainer {
        width: 90vw;
        height: 500px;
        position: relative;
        top: 50px;
        z-index: 15;
        margin: auto;
        transition:0.4s;
        -webkit-transition:0.4s;
        -moz-transition:0.4s;

        .addDeviceContainer {
            border: 1px solid ${Colors.lightGray};
            background-color: ${Colors.whiteBlue};
            padding: 20px;
            position: relative;
            z-index: 10;
            height: 90%;
            overflow-y: scroll;
            -webkit-box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
            -moz-box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
            box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: auto;

            .deviceSearchBox {
                width: 98%;
                height: 30px;
                font-size: 30px;
                padding: 10px;
                margin-bottom: 30px;
            }
        }
    }
`

const AddDevice = () => {
    library.add(faTimesCircle);
    const dispatch = useDispatch();
    const isAddDeviceFormOpen = useSelector(state => state.isAddDeviceFormOpen);
    const searchResults = useSelector(state => state.searchResults);
    const isdeviceBeingEdited = useSelector(state => state.deviceBeingEdited);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        document.querySelector('.closeIcon').addEventListener('click', () => {
            openCloseAddDeviceForm(false);
            dispatch(currentStep(1));
            dispatch(addDeviceFormValues({}));
            dispatch(deviceBeingEdited(false));

        })
    }, [isAddDeviceFormOpen]);

    const handleContainerOnBottom = useCallback(() => {
        dispatch(triggerStockDeviceHook());
    }, []);

    const containerRef = useBottomScrollListener(handleContainerOnBottom);

    const updateSearchTerm = e => {
        let searchTerm = e.target.value;

        if (searchTerm.length > 2) {
            setSearchTerm(searchTerm);
        } else {
            setSearchTerm('');
        }
    }

    const openCloseAddDeviceForm = open => {
        dispatch(toggleAddDeviceForm(open));
    }

    return (
        <Styles>
            <div className='addDeviceOuterContainer'>
                <CloseIconStyles>
                    <FontAwesomeIcon className='closeIcon' icon="times-circle" />
                </CloseIconStyles>
                <div className='addDeviceContainer' ref={containerRef}>
                    {!isdeviceBeingEdited ?
                        <input className='deviceSearchBox' type='text' onChange={updateSearchTerm} placeholder='Search'></input> : null
                    }

                    {!isdeviceBeingEdited ?
                        <StockSearchResults searchTerm={searchTerm} /> : null
                    }

                    {isdeviceBeingEdited || searchResults.length === 0 ?
                        <SteppedForm /> :
                        null
                    }
                </div>
            </div>
        </Styles>
    )
}

export default AddDevice;