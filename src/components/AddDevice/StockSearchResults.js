import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchResults } from '../../actions';
import SearchResultsCard from './SearchResultsCard';
import styled from 'styled-components';
import Colors from '../../styles/colors';

const Styles = styled.div`
    .stockSearchResultsContainer {
        width: 100%;
        height: 100%;
        background-color: ${Colors.whiteBlue};
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
    }
`

const StockSearchResults = props => {

    const dispatch = useDispatch();
    const allStockDevices = useSelector(state => state.allStockDevices);
    const searchResults = useSelector(state => state.searchResults);
    const userData = useSelector(state => state.userData);

    useEffect(() => {
        dispatch(setSearchResults(getSearchResults(props.searchTerm)));
    }, [props.searchTerm]);

    const getSearchResults = searchTerm => {
        const results = allStockDevices.filter(device =>
            device.general.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.general.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
        );
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