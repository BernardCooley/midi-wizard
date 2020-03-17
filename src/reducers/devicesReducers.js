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
    }
}

export default deviceReducers;