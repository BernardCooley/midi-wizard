const deviceReducers = {
    stockDevices: (state = [], action) => {
        switch(action.type) {
            case 'STOCK_DEVICES':
                return state = action.payload;
            default:
                return state;
        }
    },
    userDevices: (state = [], action) => {
        switch(action.type) {
            case 'USER_DEVICES':
                return state = action.payload;
            default:
                return state;
        }
    },
    toggleAddDeviceForm: (state = false, action) => {
        switch(action.type) {
            case 'ADD_DEVICE_FORM':
                return state = action.payload;
            default:
                return state;
        }
    },
    isDeviceTrayOpen: (state = false, action) => {
        switch(action.type) {
            case 'IS_DEVICE_TRAY_OPEN':
                return !state;
            default:
                return state;
        }
    },
    searchResults: (state = [], action) => {
        switch(action.type) {
            case 'SEARCH_RESULTS':
                return state = action.payload;
            default:
                return state;
        }
    }
}

export default deviceReducers;