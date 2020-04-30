const addDeviceReducers = {
    addDeviceFormValues: (state = [], action) => {
        switch (action.type) {
            case 'ADD_DEVICE_FORM_VALUES':
                return state = action.payload;
            default:
                return state;
        }
    },
    currentStep: (state = 1, action) => {
        switch (action.type) {
            case 'CURRENT_STEP':
                return state = action.payload;
            default:
                return state;
        }
    }
}

export default addDeviceReducers;