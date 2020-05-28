import React from 'react';
import styled from 'styled-components';
import Colors from '../../styles/colors';

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

        .connectionKey {
            color: ${Colors.white};
        }

        .midiOutKey {
            background-color: ${Colors.midi_out};
        }
        .midiInKey {
            background-color: ${Colors.midi_in};
        }
        .midiThruKey {
            background-color: ${Colors.midi_thru};
        }
        .audioOutKey {
            background-color: ${Colors.audioOut};
        }
        .audioInKey {
            background-color: ${Colors.audioIn};
        }
    }
`;


const ConnectionLegend = () => {
    return (
        <Styles>
            <div className='legendContainer'>
                <div className='connectionKey midiOutKey'>Midi out</div>
                <div className='connectionKey midiInKey'>Midi in</div>
                <div className='connectionKey midiThruKey'>Midi thru</div>
                <div className='connectionKey audioOutKey'>Audio out</div>
                <div className='connectionKey audioInKey'>Audio in</div>
            </div>
        </Styles>
    )
}

export default ConnectionLegend;