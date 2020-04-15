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
    const stockDevices = useSelector(state => state.stockDevices);
    const userDeviceIds = useSelector(state => state.userDeviceIds);
    const searchResults = useSelector(state => state.searchResults);

    useEffect(() => {
        dispatch(setSearchResults(getSearchResults(props.searchTerm)));
    }, [props.searchTerm, userDeviceIds]);

    const getSearchResults = searchTerm => {
        const results = stockDevices.filter(device =>
            device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
        );
        results.forEach(device => {
            device.inDeviceTray = userDeviceIds.filter(userDeviceId => userDeviceId === device.deviceId).length > 0 ? true : false;
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