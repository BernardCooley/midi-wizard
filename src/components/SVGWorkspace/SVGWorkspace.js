import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { select } from 'd3';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import LayoutDevice from '../SVGWorkspace/LayoutDevice';
import ConnectionModal from './ConnectionModal';
import { useSelector } from 'react-redux';
import ConnectionLegend from './ConnectionLegend';


const Styles = styled.div`
    .svgWorkspaceContainer {
        background-color: ${Colors.darkTeal};
        width: auto;
        height: 100vh;
        padding: 50px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
`

const SVGWorkspace = props => {

    const deviceIdToEdit = useSelector(state => state.selectedLayoutDeviceId);

    // const svgRef = useRef();

    // const [data, setData] = useState([23, 54, 18, 20, 46]);
    // const [deviceContainerSize, setDeviceContainerSize] = useState({
    //     'width': 100,
    //     'height': 100
    // });
    // const [deviceCoordinates, setDeviceCoordinates] = useState({
    //     'x': 200,
    //     'y': 100
    // });


    // useEffect(() => {
    //     if (props.layout.devices) {
    //         const svg = select(svgRef.current);

    //         svg.selectAll('rect')
    //             .data(props.layout.devices)
    //             .join('rect')
    //             .attr('width', deviceContainerSize.width)
    //             .attr('height', deviceContainerSize.height)
    //             .attr('x', d => d.svg.x - deviceContainerSize.width)
    //             .attr('y', d => d.svg.y)
    //             .attr('fill', Colors.lightGray);

    //         svg.selectAll('text')
    //             .data(props.layout.devices)
    //             .join('text')
    //             .text(d => d.deviceName)
    //             .attr('x', d => d.svg.x - deviceContainerSize.width)
    //             .attr('y', d => d.svg.y)
    //     }
    // }, [data, props.layout.devices]);

    return (
        <Styles>
            {/* <svg ref={svgRef} id='svgWorkspace' className='svgWorkspaceContainer'></svg> */}

            <div className='svgWorkspaceContainer'>
                {props.layout.devices ? props.layout.devices.map((device, index) => (
                    <LayoutDevice key={index} device={device}></LayoutDevice>
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