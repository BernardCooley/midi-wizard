const workspaceReducers = {
    getWorkspaceDevices: (state = [], action) => {
        switch(action.type) {
            case 'GET_WORKSPACE_DEVICES':
                return state = action.payload;
            default:
                return state;
        }
    },
    selectedLayoutId: (state = '', action) => {
        switch(action.type) {
            case 'GET_LAYOUT_ID':
                return state = action.payload;
            default:
                return state;
        }
    },
    currentLayout: (state = [], action) => {
        switch(action.type) {
            case 'CURRENT_LAYOUT':
                return state = action.payload;
            default:
                return state;
        }
    },
    layouts: (state = [], action) => {
        switch(action.type) {
            case 'LAYOUTS':
                return state = action.payload;
            default:
                return state;
        }
    }
}

export default workspaceReducers;