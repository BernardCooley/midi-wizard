import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchResults } from '../../actions';
import SearchResultsCard from './SearchResultsCard';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import useFirebaseCall from '../../hooks/useFirebaseCall';

const Styles = styled.div`
    width: 100%;

    .stockSearchResultsContainer {
        width: 100%;
        height: 100%;
        background-color: ${Colors.whiteBlue};
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
    }
`

const StockSearchResults = props => {
    const dispatch = useDispatch();
    const searchResults = useSelector(state => state.searchResults);
    const userData = useSelector(state => state.userData);
    const stockTrigger = useSelector(state => state.triggerStockDeviceHook);
    const [stockDevices, error, getNextDevices] = useFirebaseCall([], 'Stock', 'itemID', 20);

    useEffect(() => {
        if (stockDevices) {
            dispatch(setSearchResults(getSearchResults(props.searchTerm)));
        }
    }, [props.searchTerm, stockDevices]);

    useEffect(() => {
        if (searchResults.length > 0) {
            getNextDevices();
        }
    }, [stockTrigger]);

    useEffect(() => {
        dispatch(setSearchResults(stockDevices));
    }, []);

    const getSearchResults = searchTerm => {
        let results = [];

        if (searchTerm.length > 0) {
            results = stockDevices.filter(device =>
                device.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                device.maker[0].title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else {
            results = stockDevices;
        }

        results.forEach(device => {
            device.inDeviceTray = userData.devices.filter(userDevice => userDevice.deviceId === device.deviceId).length > 0 ? true : false;
        });
        return results;
    }

    return (
        <Styles>
            <div className='stockSearchResultsContainer'>
                {searchResults.length > 0 ? searchResults.map((device, index) => (
                    <SearchResultsCard key={index} device={device} />
                )) : null}
            </div>
        </Styles>
    )
}

StockSearchResults.propTypes = {
    searchTerm: PropTypes.string
}

export default StockSearchResults;