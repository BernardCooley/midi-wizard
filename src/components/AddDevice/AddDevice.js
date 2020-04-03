import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAddDeviceForm } from '../../actions';
import StockSearchResults from './StockSearchResults';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import ManualAddForm from '../AddDevice/ManualAddForm';
import styled from 'styled-components';


const Styles = styled.div`
    .addDeviceOuterContainer {
        width: 90%;
        max-height: 500px;
        position: relative;
        top: 50px;
        z-index: 15;

        .svg {
            position: relative;
            right: 7px;
            top: 23px;
            font-size: 30px;
            cursor: pointer;
            z-index: 20;
        }

        .addDeviceContainer {
            border: 1px solid lightgray;
            background-color: white;
            padding: 20px;
            position: relative;
            z-index: 10;
            height: 100%;
            overflow-y: scroll;
            -webkit-box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
            -moz-box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
            box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);

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
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        document.querySelector('.closeIcon').addEventListener('click', () => {
            openCloseAddDeviceForm(false);
        })
    }, [isAddDeviceFormOpen]);

    const updateSearchTerm = e => {
        let searchTerm = e.target.value;

        if(searchTerm.length > 2) {
            setSearchTerm(searchTerm);
        }else {
            setSearchTerm('');
        }
    }

    const openCloseAddDeviceForm = open => {
        dispatch(toggleAddDeviceForm(open));
    }

    return(
        <Styles>
            <div className='addDeviceOuterContainer'>
                <FontAwesomeIcon className='svg closeIcon' icon="times-circle" />
                <div className='addDeviceContainer'>
                    <input className='deviceSearchBox' type='text' onChange={updateSearchTerm} placeholder='Search'></input>

                    <StockSearchResults searchTerm={searchTerm}/>

                    {searchResults.length === 0 ?
                        <ManualAddForm/> :
                        null
                    }
                </div>
            </div>
        </Styles>
    )
}

export default AddDevice;