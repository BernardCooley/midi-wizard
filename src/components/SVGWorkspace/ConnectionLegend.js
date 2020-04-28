import React from 'react';
import styled from 'styled-components';
import Colors from '../../styles/colors';
import FilterList from '@material-ui/icons/FilterList';
import Publish from '@material-ui/icons/Publish';
import PropTypes from 'prop-types';

const Styles = styled.div`
    .legendContainer {
        width: auto;
        height: auto;
        background-color: ${Colors.whiteBlueOpaque};
        position: fixed;
        bottom: 15px;
        left: 15px;
        padding: 10px;
        -webkit-box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
        -moz-box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);
        box-shadow: 8px 10px 19px -2px rgba(0,0,0,0.76);

        .connectionContainer {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: space-between;
            width: 120px;
            height: 28px;

            .connectionIcons {
                width: 57px;
                height: 25px;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                width: 35px;

                .midiIcon, .audioIcon {
                    font-size: 30px;
                }

                .midiOutIcon, .midiThruIcon, .midiThruIcon2, .audioIn {
                    transform: rotate(270deg);
                }

                .midiThruIcon2 {
                    position: relative;
                    right: 17px;
                }

                .midiInIcon, .audioOut {
                    transform: rotate(90deg);
                }
            }
        }
    }
`;


const ConnectionLegend = () => {

    const MidiIcon = props => {
        return (
            <div className='connectionContainer'>
                <div className='connectionIcons'>
                    <FilterList className={`connectionIcon midiIcon ${props.connectionclass}`} />
                    {props.connectiontype === 'thru' ?
                        <FilterList className={`connectionIcon midiIcon ${props.connectiontype === 'thru' ? 'midiThruIcon2' : ''}`} /> : null
                    }
                </div>
                <div className='labelContainer'>Midi {props.connectiontype}</div>
            </div>
        )
    }

    const AudioIcon = props => {
        return (
            <div className='connectionContainer'>
                <div className='connectionIcons'>
                    <Publish className={`connectionIcon audioIcon ${props.connectionclass}`} />
                </div>
                <div className='labelContainer'>Audio {props.connectiontype}</div>
            </div>
        )
    }

    const propTypes = {
        connectionclass: PropTypes.string,
        connectiontype: PropTypes.string
    }

    MidiIcon.propTypes = propTypes;

    AudioIcon.propTypes = propTypes;


    return (
        <Styles>
            <div className='legendContainer'>
                <MidiIcon connectionclass='midiOutIcon' connectiontype='out' />
                <MidiIcon connectionclass='midiThruIcon' connectiontype='thru' />
                <MidiIcon connectionclass='midiInIcon' connectiontype='in' />
                <AudioIcon connectionclass='audioOut' connectiontype='out' />
                <AudioIcon connectionclass='audioIn' connectiontype='in' />
            </div>
        </Styles>
    )
}

export default ConnectionLegend;