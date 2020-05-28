import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LayoutDevice from '../SVGWorkspace/LayoutDevice';
import ConnectionLegend from './ConnectionLegend';
import Colors from '../../styles/colors';
import { useDispatch, useSelector } from 'react-redux';
import { chartData } from '../../actions';


const Styles = styled.div`
    width: 100%;

    .svgWorkspaceContainer {
        background-color: ${Colors.middleGray2};
        background-image: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent);
        background-size: 50px 50px;
        width: auto;
        height: 100vh;
        padding: 50px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding-top: 100px;
    }
`

const SVGWorkspace = props => {

    const dispatch = useDispatch();
    const charts = useSelector(state => state.chartData);
    const selections = useSelector(state => state.connectionSelections);

    const colors = {
        midi_in: 'black',
        midi_out: 'red',
        midi_thru: 'blue',
        audioOut: 'green',
        audioIn: 'purple',
    }

    const dataMock = [
        { title: 'midiIn', value: 10, color: colors.midi_in },
        { title: 'midiOut', value: 10, color: colors.midi_out },
        { title: 'midiThru', value: 10, color: colors.midi_thru },
        { title: 'Audio out 1', value: 10, color: colors.audioOut },
        { title: 'Audio in 1', value: 10, color: colors.audioIn },
        { title: 'Audio out 2', value: 10, color: colors.audioOut },
        { title: 'Audio in 2', value: 10, color: colors.audioIn },
        { title: 'Audio out 3', value: 10, color: colors.audioOut },
        { title: 'Audio in 3', value: 10, color: colors.audioIn },
        { title: 'Audio out 4', value: 10, color: colors.audioOut },
        { title: 'Audio in 4', value: 10, color: colors.audioIn },
    ];

    useEffect(() => {
        if (props.layout.devices) {
            addChartData(props.layout.devices);
        }

        document.addEventListener('click', e => {
            if (e.target.getAttribute('class')) {
                if (e.target.getAttribute('class').includes('svgWorkspaceContainer') || e.target.parentNode.getAttribute('class').includes('svgWorkspaceContainer')) {
                    if (props.layout.devices) {
                        addChartData(props.layout.devices);
                    }
                }
            }
        });
    }, [props.layout]);

    useEffect(() => {
        if (selections.length === 1) {
            filterChartData();
        }
    }, [selections]);

    const filterChartData = () => {
        const filteredCharts = [];

        charts.forEach(chart => {
            let option = [];

            if (selections[0].connectionName === 'midi_out' || selections[0].connectionName === 'midi_thru') {
                option = chart.filter(option => option.title === 'midi_in');
            } else if (selections[0].connectionName === 'midi_in') {
                option = chart.filter(option => option.title === 'midi_out' || option.title === 'midi_thru');
            } else if (selections[0].connectionType === 'audioOut') {
                option = chart.filter(option => option.type === 'audioIn');
            } else if (selections[0].connectionType === 'audioIn') {
                option = chart.filter(option => option.type === 'audioOut');
            }

            if (option) {
                filteredCharts.push(option)
            } else {
                filteredCharts.push([]);
            }
        });

        dispatch(chartData(filteredCharts));
    }

    const addChartData = layoutDevices => {
        let devices = [];

        Object.keys(layoutDevices).forEach(deviceKey => {
            const data = [];

            Object.keys(layoutDevices[deviceKey].midi).forEach(key => {
                if (layoutDevices[deviceKey].midi[key].enabled) {
                    data.push({
                        title: key,
                        value: 10,
                        color: colors[key],
                        deviceId: deviceKey
                    })
                }
            });
            Object.keys(layoutDevices[deviceKey].audio.audioOut).forEach(key => {
                data.push({
                    title: key,
                    value: 10,
                    color: colors.audioOut,
                    type: 'audioOut',
                    deviceId: deviceKey
                })
            });
            Object.keys(layoutDevices[deviceKey].audio.audioIn).forEach(key => {
                data.push({
                    title: key,
                    value: 10,
                    color: colors.audioIn,
                    type: 'audioIn',
                    deviceId: deviceKey
                })
            });
            devices = [...devices, data];
        });
        dispatch(chartData(devices));
    }


    return (
        <Styles>
            <div className='svgWorkspaceContainer'>
                {props.layout.devices ? Object.keys(props.layout.devices).map((key, index) => (
                    <LayoutDevice key={index} device={props.layout.devices[key]}></LayoutDevice>
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