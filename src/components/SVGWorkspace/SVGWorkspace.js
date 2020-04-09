import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { select } from 'd3';
import styled from 'styled-components';


const Styles = styled.div`
    .svgWorkspaceContainer {
        background-color: rebeccapurple;
        width: 100vw;
        height: 100vh;
    }
`

const SVGWorkspace = props => {
    const svgRef = useRef();

    const [data, setData] = useState([23, 54, 18, 20, 46]);
    const [deviceContainerSize, setDeviceContainerSize] = useState({
        'width': 100,
        'height': 100
    });
    const [deviceCoordinates, setDeviceCoordinates] = useState({
        'x': 200,
        'y': 100
    });


    useEffect(() => {
        if (props.layout.devices) {
            const svg = select(svgRef.current);

            svg.selectAll('rect')
                .data(props.layout.devices)
                .join('rect')
                .attr('width', deviceContainerSize.width)
                .attr('height', deviceContainerSize.height)
                .attr('x', d => d.svg.x - deviceContainerSize.width)
                .attr('y', d => d.svg.y)
                .attr('fill', 'lightgray');

            svg.selectAll('text')
                .data(props.layout.devices)
                .join('text')
                .text(d => d.deviceName)
                .attr('x', d => d.svg.x - deviceContainerSize.width)
                .attr('y', d => d.svg.y)
        }
    }, [data, props.layout.devices]);

    return (
        <Styles>
            <svg ref={svgRef} id='svgWorkspace' className='svgWorkspaceContainer'></svg>
        </Styles>
    )
}

SVGWorkspace.propTypes = {
    layout: PropTypes.array
}

export default SVGWorkspace;