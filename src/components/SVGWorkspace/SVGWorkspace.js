import React, { useRef, useEffect, useState } from 'react';
import { select } from 'd3';

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
        if(props.layout.devices) {
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

    const styles = {
        svgWorkspaceContainer: {
            backgroundColor: 'rebeccapurple',
            width: '100%'
        }
    }

    return (
        <React.Fragment>
            <svg ref={svgRef} id='svgWorkspace' style={styles.svgWorkspaceContainer} className='svgWorkspaceContainer'></svg>
        </React.Fragment>
    )
}

export default SVGWorkspace;