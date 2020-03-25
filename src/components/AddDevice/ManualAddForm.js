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
            flexDirection: 'row',
            alignItems: 'flex-start'
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
            flexDirection: 'column',
            position: 'relative',
            top: '-13px'
        },
        checkboxInputContainer: {
            display: 'flex',
            alignItems: 'center'
        },
        manufacturerInputContainer: {
            
        },
        checkboxField: {
            height: '25px',
            width: '25px'
        },
        inputField: {
            width: '80%',
            height: '100%',
            fontSize: '20px',
            margin: '5px 0',
            height: '30px'
        },
        deviceTypeTitle: {
            fontSize: '25px'
        },
        suggentionItem: {
            cursor: 'pointer'
        }
    }

    return (
        <div style={styles.manualAddFormContainer} className='manualAddFormContainer'>
            <form style={styles.manualAddDeviceForm} className='manualAddDeviceForm' onSubmit={addDevice} autoComplete="off">
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
                    <div style={styles.deviceTypeTitle} className='deviceTypeTitle'>Device type</div>
                    <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                        <input style={styles.checkboxField} type="checkbox" id='keyboard' name="deviceType" value="keyboard"/>
                        <label htmlFor="keyboard"> Keyboard</label>
                    </div>
                    <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                        <input style={styles.checkboxField} type="checkbox" id='synth' name="deviceType" value="synth"/>
                        <label htmlFor="synth"> Synth</label>
                    </div>
                    <div style={styles.checkboxInputContainer} className='checkboxInputContainer'>
                        <input style={styles.checkboxField} type="checkbox" id='padController' name="deviceType" value="padController"/>
                        <label htmlFor="padController"> Pad controller</label>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ManualAddForm;