import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import { Stage, Layer, Line, Group, Text } from 'react-konva';
import WorkspaceDevice from './WorkspaceDevice';
import { useSelector, Provider, useDispatch } from 'react-redux';
import { store } from '../../index';
import { stageScale } from '../../actions';
import WorkspaceControls from '../SVGWorkspace/WorkSpaceControls';


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
    const [stageX, setStageX] = useState();
    const [stageY, setStageY] = useState();
    const [positions, setPositions] = useState();
    const [connections, setConnections] = useState([]);
    const userId = useSelector(state => state.currentUserId);
    const scaleStage = useSelector(state => state.stageScale);
    const userLayouts = useSelector(state => state.layouts);
    const showAudioConnections = useSelector(state => state.showAudioConnections);
    const showMidiConnections = useSelector(state => state.showMidiConnections);
    const [clearSelection, setClearSelection] = useState(false);
    const devices = props.layout.devices;

    useEffect(() => {
        if (devices) {
            getPositions();
        }
    }, [devices]);

    useEffect(() => {
        if (devices) {
            setConnectionLines();
        }
    }, [positions]);

    const getPositions = () => {
        setPositions(
            Object.keys(devices).map(key => {
                return {
                    x: devices[key].position.x,
                    y: devices[key].position.y,
                    deviceId: devices[key].deviceId
                }
            })
        );
    }

    const setConnectionLines = () => {
        const connectionArray = [];

        Object.keys(devices).forEach(deviceKey => {
            const deviceAudioInKeys = Object.keys(devices[deviceKey].audio.audioIn);

            if (deviceAudioInKeys.length > 0) {
                deviceAudioInKeys.forEach(deviceAudioInKey => {
                    if (devices[deviceKey].audio.audioIn[deviceAudioInKey].length > 0) {
                        let outputName = '';

                        const fromDeviceAudio = devices[devices[deviceKey].audio.audioIn[deviceAudioInKey]].audio.audioOut

                        Object.keys(fromDeviceAudio).forEach(audioOutputKey => {
                            if (fromDeviceAudio[audioOutputKey] === devices[deviceKey].deviceId) {
                                outputName = audioOutputKey;
                            }
                        });

                        const inputDevicePosition = positions.filter(position => position.deviceId === devices[deviceKey].deviceId)[0];

                        const outputDevicePosition = positions.filter(position => position.deviceId === devices[deviceKey].audio.audioIn[deviceAudioInKey])[0];

                        const connection = {
                            id: `${devices[deviceKey].audio.audioIn[deviceAudioInKey]}-${devices[deviceKey].deviceId}-${outputName}-${deviceAudioInKey}`,
                            type: 'audio',
                            from: {
                                deviceId: devices[deviceKey].audio.audioIn[deviceAudioInKey],
                                output: outputName,
                                position: {
                                    x: outputDevicePosition.x,
                                    y: outputDevicePosition.y
                                }
                            },
                            to: {
                                deviceId: devices[deviceKey].deviceId,
                                input: deviceAudioInKey,
                                position: {
                                    x: inputDevicePosition.x,
                                    y: inputDevicePosition.y
                                }
                            },
                            midPoint: {
                                x: (Math.abs((outputDevicePosition.x - inputDevicePosition.x)) / 2) + Math.min(outputDevicePosition.x, inputDevicePosition.x) + rand(0, 100),
                                y: (Math.abs((outputDevicePosition.y - inputDevicePosition.y)) / 2) + Math.min(outputDevicePosition.y, inputDevicePosition.y) - rand(0, 100)
                            }
                        }

                        connectionArray.push(connection);
                    }
                });
            }
            setConnections(connectionArray);
        })
    }

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
        setStageX(-(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale);
        setStageY(-(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale);
    };

    const findMidPoint = conn => {
        const from = conn.from.position;
        const to = conn.to.position;

        const midX = (Math.abs((from.x - to.x)) / 2) + Math.min(from.x, to.x);
        const midY = (Math.abs((from.y - to.y)) / 2) + Math.min(from.y, to.y);

        return {
            x: midX,
            y: midY
        }
    }

    const buildGradient = connection => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(
            connection.from.position.x,
            connection.from.position.y,
            connection.to.position.x,
            connection.to.position.y,
        );

        if (connection.type === 'audio') {
            grad.addColorStop(0.3, 'green');
            grad.addColorStop(1, 'red');
        } if (connection.type === 'midiOutIn') {
            grad.addColorStop(0, 'black');
            grad.addColorStop(1, 'blue');
        } else if (connection.type === 'midiThruIn') {
            grad.addColorStop(0, 'yellow');
            grad.addColorStop(1, 'blue');
        }

        return grad;
    }

    const getPoints = connection => {
        return [
            connection.from.position.x + rand(0, 100),
            connection.from.position.y + 50,
            connection.midPoint.x,
            connection.midPoint.y,
            connection.to.position.x + 50,
            connection.to.position.y + 50
        ];
    }

    const rand = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    return (
        <Styles>
            <div id='svgWorkspaceContainer' className='svgWorkspaceContainer'>
                <WorkspaceControls/>
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
                            {connections ? connections.map(connection => (
                                <Group>
                                    <Line
                                        name={connection.type}
                                        key={connection}
                                        points={getPoints(connection)}
                                        strokeWidth={3}
                                        stroke={buildGradient(connection)}
                                        tension={rand(0.2, 1)}
                                        visible={
                                            (connection.type === 'audio' && showAudioConnections) || 
                                            (connection.type === 'midi' && showMidiConnections)
                                        }
                                    />
                                    {/* <Text
                                        x={connection.midPoint.x}
                                        y={connection.midPoint.y}
                                        text={`${connection.from.output} -> ${connection.to.input}`}
                                        fill='white'
                                        zIndex={10}
                                    /> */}
                                </Group>
                            )) : null}
                            {devices && Object.keys(devices).length > 0 ? Object.keys(devices).map(device => (
                                <WorkspaceDevice clearselection={clearSelection} key={device} userid={userId} userlayouts={userLayouts} device={devices[device]} />
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