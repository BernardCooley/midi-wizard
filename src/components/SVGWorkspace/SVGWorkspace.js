import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import { Stage, Layer } from 'react-konva';
import ConnectionLegend from './ConnectionLegend';
import WorkspaceDevice from './WorkspaceDevice';
import { useSelector } from 'react-redux';


const Styles = styled.div`
    width: 100%;

    .svgWorkspaceContainer {
        background-color: ${Colors.middleGray2};
        background-image: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent);
        background-size: 50px 50px;
        width: auto;
        height: 100vh;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding-top: 50px;
    }
`

const SVGWorkspace = props => {

    const [stageScale, setStageScale] = useState();
    const [stageX, setstageX] = useState();
    const [stageY, setstageY] = useState();
    const userId = useSelector(state => state.currentUserId);
    const userLayouts = useSelector(state => state.layouts);

    const handleWheel = e => {
        e.evt.preventDefault();

        const scaleBy = 0.98;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        setStageScale(newScale);
        setstageX(-(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale);
        setstageY(-(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale);
    };

    return (
        <Styles>
            <div id='svgWorkspaceContainer' className='svgWorkspaceContainer'>
                <Stage
                    scaleX={stageScale}
                    scaleY={stageScale}
                    x={stageX}
                    y={stageY}
                    onWheel={handleWheel}
                    width={window.innerWidth}
                    height={window.innerHeight}>
                    <Layer>
                        {props.layout.devices && Object.keys(props.layout.devices).length > 0 ? Object.keys(props.layout.devices).map((device, index) => (
                            <WorkspaceDevice key={index} userid={userId} userlayouts={userLayouts} device={props.layout.devices[device]} />
                        )) : null}
                    </Layer>
                </Stage>
            </div>
            <ConnectionLegend />
        </Styles>
    )
}

SVGWorkspace.propTypes = {
    layout: PropTypes.array
}

export default SVGWorkspace;