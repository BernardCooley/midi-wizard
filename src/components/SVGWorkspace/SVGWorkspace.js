import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LayoutDevice from '../SVGWorkspace/LayoutDevice';
import ConnectionLegend from './ConnectionLegend';
import Colors from '../../styles/colors';


const Styles = styled.div`
    width: 100%;

    .svgWorkspaceContainer {
        background-color: ${Colors.middleGray2};
        background-image: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent);
        background-size: 50px 50px;
        width: auto;
        height: 100vh;
        padding: 50px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
`

const SVGWorkspace = props => {

    return (
        <Styles>
            <div className='svgWorkspaceContainer'>
                {props.layout.devices ? Object.keys(props.layout.devices).map((key, index) => (
                    <LayoutDevice key={index} device={props.layout.devices[key]}></LayoutDevice>
                )) : null}
            </div>
            <ConnectionLegend />
        </Styles>
    )
}

SVGWorkspace.propTypes = {
    layout: PropTypes.object
}

export default SVGWorkspace;