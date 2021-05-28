import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import { Stage, Layer } from 'react-konva';
import WorkspaceDevice from './WorkspaceDevice';
import { useSelector, Provider, useDispatch } from 'react-redux';
import { store } from '../../index';
import { stageScale } from '../../actions';


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
    const dispatch = useDispatch();
    const [stageX, setstageX] = useState();
    const [stageY, setstageY] = useState();
    const userId = useSelector(state => state.currentUserId);
    const scaleStage = useSelector(state => state.stageScale);
    const userLayouts = useSelector(state => state.layouts);
    const [clearSelection, setClearSelection] = useState(false);

    const handleWheel = e => {
        e.evt.preventDefault();

        const scaleBy = 0.94;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        dispatch(stageScale(newScale));
        setstageX(-(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale);
        setstageY(-(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale);
    };

    return (
        <Styles>
            <div id='svgWorkspaceContainer' className='svgWorkspaceContainer'>
                <Stage
                    name={'stage'}
                    onClick={e => {
                        if (e.target.name() === 'stage') {
                            setClearSelection(clearSelection => !clearSelection);
                        }
                    }}
                    scaleX={scaleStage}
                    scaleY={scaleStage}
                    x={stageX}
                    y={stageY}
                    onWheel={handleWheel}
                    width={window.innerWidth - 50}
                    height={window.innerHeight}
                    draggable={true}
                    onDragStart={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = 'grabbing';
                    }}
                    onDragEnd={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = 'default';
                    }}>
                    <Layer>
                        <Provider store={store}>
                            {props.layout.devices && Object.keys(props.layout.devices).length > 0 ? Object.keys(props.layout.devices).map((device, index) => (
                                <WorkspaceDevice clearselection={clearSelection} key={index} userid={userId} userlayouts={userLayouts} device={props.layout.devices[device]} />
                            )) : null}
                        </Provider>
                    </Layer>
                </Stage>
            </div>
        </Styles>
    )
}

SVGWorkspace.propTypes = {
    layout: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
}

export default SVGWorkspace;