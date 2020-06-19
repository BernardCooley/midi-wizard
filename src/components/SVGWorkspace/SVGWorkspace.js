import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import { useSelector } from 'react-redux';
import { Stage, Layer, Text, Group, Image } from 'react-konva';
import firebase from 'firebase';
import ConnectionLegend from './ConnectionLegend';
import sweetAlert from 'sweetalert2';


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
    const userLayouts = useSelector(state => state.layouts);
    const db = firebase.firestore();
    const usersRef = db.collection('Users');
    const userId = useSelector(state => state.currentUserId);
    const [stageScale, setStageScale] = useState();
    const [stageX, setstageX] = useState();
    const [stageY, setstageY] = useState();
    const [imageObject, setImageObject] = useState(0);

    useEffect(() => {
        const image = new window.Image();
        image.src = "https://i.imgur.com/g5iIJz9.jpg";
        image.onload = () => {
            setImageObject(image);
        };
        image.crossOrigin = "Anonymous";
    }, []);

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

    const updatePosition = async (device, x, y) => {
        device.position.x = x;
        device.position.y = y;

        await usersRef.doc(userId).update({
            layouts: userLayouts
        }).then().catch(error => {
            sweetAlert.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! You may be disconnected from the internet. Please try again later.'
            });
            console.error(error);
        });
    }

    const WorkspaceDevice = (props) => {
        return (
            <Group
                draggable={true}
                x={props.device.position.x}
                y={props.device.position.y}
                width={100}
                height={100}
                onDragEnd={(data) => {
                    updatePosition(props.device, data.currentTarget.attrs.x, data.currentTarget.attrs.y);
                }}>
                <Image
                    image={imageObject}
                    width={100}
                    height={100}
                />
                <Text
                    text={props.device.general.deviceName}
                    fontSize={15}
                    align={'center'}
                    verticalAlign={'middle'}
                    wrap={'word'}
                    width={100}
                    height={100} />
            </Group>
        )
    }

    WorkspaceDevice.propTypes = {
        device: PropTypes.object
    }


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
                            <WorkspaceDevice key={index} device={props.layout.devices[device]} />
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