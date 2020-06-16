import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import { useSelector } from 'react-redux';
import Konva from 'konva/lib/Core';
import { Rect } from 'konva/lib/shapes/Rect';
import { Text } from 'konva/lib/shapes/Text';
import firebase from 'firebase';
import ConnectionLegend from './ConnectionLegend';


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
    const selections = useSelector(state => state.connectionSelections);
    const userLayouts = useSelector(state => state.layouts);
    const db = firebase.firestore();
    const usersRef = db.collection('Users');
    const userId = useSelector(state => state.currentUserId);

    useEffect(() => {
        if (props.layout.devices) {
            createworkspace(props.layout.devices);
        }
    }, [props.layout]);

    const createworkspace = devices => {
        let stage = new Konva.Stage({
            height: window.innerHeight,
            width: window.innerWidth,
            container: 'svgWorkspaceContainer'
        });

        setZoom(stage);

        const mainLayer = new Konva.Layer({
            draggable: true
        });
        stage.add(mainLayer);

        Object.keys(devices).forEach(device => {
            addDevice(mainLayer, devices[device]);
        });
    }

    const setZoom = stage => {
        const scaleBy = 0.98;
        stage.on('wheel', (e) => {
            e.evt.preventDefault();
            const oldScale = stage.scaleX();

            const pointer = stage.getPointerPosition();

            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };

            const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

            stage.scale({ x: newScale, y: newScale });

            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            stage.position(newPos);
            stage.batchDraw();
        });
    }

    const addDevice = (mainLayer, device) => {
        if (!device.position) {
            device['position'] = {};
            device['position']['x'] = 300;
            device['position']['y'] = 300;
        }

        let deviceGroup = new Konva.Group({
            draggable: true,
            x: device.position.x,
            y: device.position.y
        });

        const rect = new Rect({
            fill: 'blue',
            width: 100,
            height: 100,
            shadowColor: 'black',
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowOpacity: 0.2
        });

        const text = new Text({
            text: device.general.deviceName,
            fontSize: 20,
            align: 'center',
            verticalAlign: 'middle',
            wrap: 'word',
            width: 100,
            height: 100
        })

        deviceGroup.add(rect);
        deviceGroup.add(text);

        deviceGroup.on('dragend', function () {
            updatePosition(device, deviceGroup.attrs.x, deviceGroup.attrs.y);
        });

        mainLayer.add(deviceGroup);
        mainLayer.draw();
    }

    const updatePosition = async (device, x, y) => {
        device.position.x = x;
        device.position.y = y;

        await usersRef.doc(userId).update({
            layouts: userLayouts
        });
    }


    return (
        <Styles>
            <div id='svgWorkspaceContainer' className='svgWorkspaceContainer'>
            </div>
            <ConnectionLegend />
        </Styles>
    )
}

SVGWorkspace.propTypes = {
    layout: PropTypes.object
}

export default SVGWorkspace;