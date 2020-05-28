import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import firebase from '../../firebase';
import { connectionSelections, connectionDevices } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../styles/colors';
import DonutChart from './DonutChart';


const Styles = styled.div`
    .midiOptions {
        height: 30px;
        position: relative;
        top: 55px;

        img {
            position: relative;
            height: 100%;
            transform: rotate(180deg);
            height: 100%;

            svg {
                color: white;
            }
        }
    }

    .deviceContainer {
        position: relative;
        width: 150px;
        height: 150px;
        margin: 0 50px;
        cursor: pointer;
        transition: all .2s ease-in-out;
        display: flex;
        justify-content: center;
        align-items: center;

        .donutChartContainer {
            position: absolute;
            opacity: 0;
            transition:0.4s;
            -webkit-transition:0.4s;
            -moz-transition:0.4s;
            width: 10px;

            svg {
                overflow: visible;
            }
        }

        .optionsDisplayed {
            opacity: 1;
            z-index: 20;
            width: 80px;
        }

        img {
            transition:0.4s;
            -webkit-transition:0.4s;
            -moz-transition:0.4s;
            
            &:hover{
                -webkit-box-shadow: 5px 8px 11px 0px ${Colors.black};
                -moz-box-shadow: 5px 8px 11px 0px ${Colors.black};
                box-shadow: 5px 8px 11px 0px ${Colors.black};
                transform: scale(1.1);
            }
        }

        .showOptions {
            display: flex;
        }

        .deviceSelected {
            outline: 5px solid green;
            -webkit-box-shadow: 0px 0px 38px 0px ${Colors.brightGreen};
            -moz-box-shadow: 0px 0px 38px 0px ${Colors.brightGreen};
            box-shadow: 0px 0px 38px 0px ${Colors.brightGreen};
            transform: scale(1.06);
        }

        .layoutDeviceImage {
            width: 100%;
            z-index: 10;
            opacity: 1;
        }

        .imageHidden {
            opacity: 0.4;
        }

        .deviceName {
            color: ${Colors.whiteBlue};
            text-align: center;
        }
    }
`;

const LayoutDevice = props => {

    const dispatch = useDispatch();

    const imageStorageRef = firebase.storage().ref();
    const [imageUrl, setImageUrl] = useState({});
    const selectedDevices = useSelector(state => state.connectionDevices);
    const charts = useSelector(state => state.chartData);
    const [currentChart, setCurrentChart] = useState([]);

    useEffect(() => {
        getDeviceImage(props.device.imageName);

        document.addEventListener('click', e => {
            if (e.target.getAttribute('class')) {
                if (e.target.getAttribute('class').includes('svgWorkspaceContainer') || e.target.parentNode.getAttribute('class').includes('svgWorkspaceContainer')) {
                    dispatch(connectionSelections([]));
                    dispatch(connectionDevices([]));
                }
            }
        });
    }, [props.device]);

    useEffect(() => {
        if (charts.length > 0 && charts[0].length > 0) {
            setCurrentChart(charts.filter(chart => chart[0] && chart[0].deviceId === props.device.deviceId)[0]);
        }
    }, [charts]);

    const getDeviceImage = async () => {
        const imageName = props.device.general.imageName;
        const imageResponse = imageStorageRef.child('deviceImages').child(imageName);

        await imageResponse.getDownloadURL().then(url => {
            setImageUrl(url);
        });
    }

    const showConnectionOptions = e => {
        if (selectedDevices.length < 2) {
            dispatch(connectionDevices([...selectedDevices, e.target.getAttribute('deviceid')]));
        }
    }

    return (
        <Styles>
            <div className='deviceContainer'>
                <div deviceid={props.device.deviceId} className={`donutChartContainer ${selectedDevices.includes(props.device.deviceId) ? 'optionsDisplayed' : ''}`}>
                    <DonutChart className='donutContainer' data={currentChart}></DonutChart>
                </div>
                <img deviceid={props.device.deviceId} onClick={showConnectionOptions} className={`layoutDeviceImage ${selectedDevices.includes(props.device.deviceId) ? 'imageHidden' : ''}`} src={imageUrl} alt='device image'></img>
            </div>
        </Styles>
    )
}

LayoutDevice.propTypes = {
    device: PropTypes.object
}

export default LayoutDevice;