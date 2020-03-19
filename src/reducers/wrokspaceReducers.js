const workspaceReducers = {
    getWorkspaceDevices: (state = [], action) => {
        switch(action.type) {
            case 'GET_WORKSPACE_DEVICES':
                return state = action.payload;
            default:
                return state;
        }
    }
}

export default workspaceReducers;