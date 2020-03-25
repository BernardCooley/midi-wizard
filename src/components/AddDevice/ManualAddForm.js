import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ManualAddForm = () => {

    const stockDevices = useSelector(state => state.stockDevices);
    const [suggestions, setSuggestions] = useState([]);

    const addDevice = async (e) => {
        e.preventDefault();
        console.log('form submitted');
    }

    const searchManufacturers = e => {
        const searchTerm = e.target.value;
        
        if(searchTerm.length > 2) {
            const matchedDevices = stockDevices.filter(device => device.manufacturer.toLowerCase().includes(e.target.value.toLowerCase()));
            setSuggestions([...new Set(matchedDevices.map(devices => devices.manufacturer))]);
        }else if(searchTerm.length === 0) {
            setSuggestions([]);
        }
    }

    const setFieldValue = e => {
        const suggestionClicked = e.target.innerText;
        e.target.parentNode.parentNode.querySelector('input').value = suggestionClicked;
        setSuggestions([]);
    }

    const styles = {
        manualAddFormContainer: {
            width: '90%',
            margin: 'auto'
        },
        manualAddDeviceForm: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
        },
        detailsContainer: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            margin: '30px 0'
        },
        manufacturerSuggestions: {
            minHeight: '30px'
        },
        inputContainer: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'flex-start'
        },
        checkboxGroupContainer: {
            width: '400px',
            display: 'flex',
            flexDirection: 'column'
        },
        checkboxInputContainer: {
            display: 'flex',
            alignItems: 'center'
        },
        manufacturerInputContainer: {
            
        },
        checkboxField: {
            height: '25px',
            width: '25px',
            cursor: 'pointer'
        },
        checkboxLabel: {
            cursor: 'pointer'
        },
        inputField: {
            width: '80%',
            height: '100%',
            fontSize: '20px',
            margin: '5px 0',
            height: '30px',
            textAlign: 'center'
        },
        checkboxGroupTitle: {
            fontSize: '25px'
        },
        suggentionItem: {
            cursor: 'pointer'
        },
        numberFields: {
            textAlign: 'center',
        }
    }

    return (
        <div style={styles.manualAddFormContainer} className='manualAddFormContainer'>
            <h2>No results found... add manually</h2>
            <form style={styles.manualAddDeviceForm} className='manualAddDeviceForm' onSubmit={addDevice} autoComplete="off">
                <div style={styles.detailsContainer} className='detailsContainer'>
                    <div style={styles.inputContainer} className='inputContainer'>
                        <input style={styles.inputField} type="text" placeholder="Manufacturer" name="manufacturer" onChange={searchManufacturers}></input>
                        <div style={styles.manufacturerSuggestions} className='manufacturerSuggestions'>
                            {suggestions.length > 0 ? suggestions.map((suggestion, index) => (
                                    <div key={index} style={styles.suggentionItem} className='suggentionItem' onClick={setFieldValue}>{suggestion}</div>
                                )):null
                            }
                        </div>
                    </div>
                    <div style={styles.inputContainer} className='inputContainer'>
                        <input style={styles.inputField} type="text" placeholder="Device name" name="deviceName"></input>
                    </div>
                    <div style={styles.checkboxGroupContainer} className='checkboxGroupContainer'>
                        <div style={styles.checkboxGroupTitle} className='checkboxGroupTitle'>Device type</div>
                        <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                            <input style={styles.checkboxField} type="checkbox" id='keyboard' name="deviceType" value="keyboard"/>
                            <label style={styles.checkboxLabel} className='checkboxLabel' htmlFor="keyboard"> Keyboard</label>
                        </div>
                        <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                            <input style={styles.checkboxField} type="checkbox" id='synth' name="deviceType" value="synth"/>
                            <label style={styles.checkboxLabel} className='checkboxLabel' htmlFor="synth"> Synth</label>
                        </div>
                        <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                            <input style={styles.checkboxField} type="checkbox" id='padController' name="deviceType" value="padController"/>
                            <label style={styles.checkboxLabel} className='checkboxLabel' htmlFor="padController"> Pad controller</label>
                        </div>
                    </div>
                </div>
                <div style={styles.detailsContainer} className='detailsContainer'>
                    <div style={styles.inputContainer} className='inputContainer'>
                        <input style={{...styles.inputField, ...styles.numberFields}} type="number" placeholder="Audio outs" name="audioOuts"></input>
                    </div>
                    <div style={styles.inputContainer} className='inputContainer'>
                        <input style={{...styles.inputField, ...styles.numberFields}} type="number" placeholder="Audio ins" name="audioIns"></input>
                    </div>
                    <div style={styles.checkboxGroupContainer} className='checkboxGroupContainer'>
                        <div style={styles.checkboxGroupTitle} className='checkboxGroupTitle'>Midi</div>
                        <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                            <input style={styles.checkboxField} type="checkbox" id='midiIn' name="midiIn" value="midiIn"/>
                            <label style={styles.checkboxLabel} className='checkboxLabel' htmlFor="midiIn"> Midi in</label>
                        </div>
                        <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                            <input style={styles.checkboxField} type="checkbox" id='midiOut' name="midiOut" value="midiOut"/>
                            <label style={styles.checkboxLabel} className='checkboxLabel' htmlFor="midiOut"> Midi out</label>
                        </div>
                        <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                            <input style={styles.checkboxField} type="checkbox" id='midiThru' name="midiThru" value="midiThru"/>
                            <label style={styles.checkboxLabel} className='checkboxLabel' htmlFor="midiThru"> Midi thru</label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ManualAddForm;