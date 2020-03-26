import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAddDeviceForm } from '../../actions';
import StockSearchResults from './StockSearchResults';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import ManualAddForm from '../AddDevice/ManualAddForm';

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

    const styles = {
        addDeviceOuterContainer: {
            width: '90%',
            maxHeight: '300px',
            position: 'relative',
            top: '50px'
        },
        addDeviceContainer: {
            border: '1px solid lightgray',
            backgroundColor: 'white',
            padding: '20px',
            position: 'relative',
            zIndex: '10',
            height: '100%',
            overflowY: 'scroll',
            ebkitBoxShadow: '4px 4px 5px 0px rgba(0,0,0,0.75)',
            MozBoxShadow: '4px 4px 5px 0px rgba(0,0,0,0.75)',
            boxShadow: '4px 4px 5px 0px rgba(0,0,0,0.75)'
        },
        svg: {
            position: 'relative',
            right: '7px',
            top: '23px',
            fontSize: '30px',
            cursor: 'pointer',
            zIndex: '20'
        },
        deviceSearchBox: {
            width: '98%',
            height: '30px',
            fontSize: '30px',
            padding: '10px',
            marginBottom: '30px'
        },
        addDeviceForm: {
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            margin: 'auto',
            padding: '50px'
        }
    }

    return(
        <div style={styles.addDeviceOuterContainer}>
            <FontAwesomeIcon style={styles.svg} className='closeIcon' icon="times-circle" />
            <div style={styles.addDeviceContainer}>
                <input style={styles.deviceSearchBox} type='text' onChange={updateSearchTerm} placeholder='Search'></input>

                <StockSearchResults searchTerm={searchTerm}/>

                {searchResults.length === 0 ?
                    <ManualAddForm/> :
                    null
                }
            </div>
        </div>
    )
}

export default AddDevice;