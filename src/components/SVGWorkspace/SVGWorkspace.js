import React, { useRef, useEffect, useState } from 'react';
import { select } from 'd3';

const SVGWorkspace = props => {
    const [data, setData] = useState([23, 54, 18, 20, 46]);
    const svgRef = useRef();

    useEffect(() => {
        if(props.layout.devices) {
            const svg = select(svgRef.current);
            svg
            .selectAll('rect')
            .data(props.layout.devices)
            .join('rect')
            .attr('width', 100)
            .attr('height', 100)
            .attr('x', (d, i) => i * 200)
            .attr('y', 100)
            .attr('stroke', 'red')
            .attr('fill', 'lightgray')
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