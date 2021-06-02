const workspaceReducers = {
    getWorkspaceDevices: (state = [], action) => {
        switch (action.type) {
            case 'GET_WORKSPACE_DEVICES':
                return state = action.payload;
            default:
                return state;
        }
    },
    selectedLayoutId: (state = '', action) => {
        switch (action.type) {
            case 'GET_LAYOUT_ID':
                return state = action.payload;
            default:
                return state;
        }
    },
    currentLayout: (state = [], action) => {
        switch (action.type) {
            case 'CURRENT_LAYOUT':
                return state = action.payload;
            default:
                return state;
        }
    },
    layouts: (state = [], action) => {
        switch (action.type) {
            case 'LAYOUTS':
                return state = action.payload;
            default:
                return state;
        }
    },
    layoutIds: (state = [], action) => {
        switch (action.type) {
            case 'LAYOUT_IDS':
                return state = action.payload;
            default:
                return state;
        }
    },
    isLayoutsTrayOpen: (state = false, action) => {
        switch (action.type) {
            case 'IS_LAYOUTS_TRAY_OPEN':
                return !state;
            default:
                return state;
        }
    },
    deletedLayoutId: (state = false, action) => {
        switch (action.type) {
            case 'DELETED_LAYOUT_ID':
                return state = action.payload;
            default:
                return state;
        }
    },
    selectedLayoutDeviceId: (state = '', action) => {
        switch (action.type) {
            case 'SELECTED_LAYOUT_DEVICE_ID':
                return state = action.payload;
            default:
                return state;
        }
    },
    connectionSelections: (state = [], action) => {
        switch (action.type) {
            case 'CONNECTION_SELECTIONS':
                return state = action.payload;
            default:
                return state;
        }
    },
    connectionDevices: (state = [], action) => {
        switch (action.type) {
            case 'CONNECTION_DEVICES':
                return state = action.payload;
            default:
                return state;
        }
    },
    chartData: (state = [], action) => {
        switch (action.type) {
            case 'CHART_DATA':
                return state = action.payload;
            default:
                return state;
        }
    },
    selectedWorkspaceDeviceId: (state = '', action) => {
        switch (action.type) {
            case 'SELECTED_WORKSPACE_DEVICE_ID':
                return state = action.payload;
            default:
                return state;
        }
    },
    drawing: (state = false, action) => {
        switch (action.type) {
            case 'DRAWING':
                return state = action.payload;
            default:
                return state;
        }
    },
    connection: (state = [
        {
            deviceId: '',
            connectionType: ''
        },
        {
            deviceId: '',
            connectionType: ''
        }
    ], action) => {
        switch (action.type) {
            case 'CONNECTION':
                return state = action.payload;
            default:
                return state;
        }
    },
    availableConnectionIds: (state = [], action) => {
        switch (action.type) {
            case 'AVAILABLE_CONNECTION_IDS':
                return state = action.payload;
            default:
                return state;
        }
    },
    stageScale: (state = 1, action) => {
        switch (action.type) {
            case 'STAGE_SCALE':
                return state = action.payload;
            default:
                return state;
        }
    },
    showAudioConnections: (state = true, action) => {
        switch (action.type) {
            case 'SHOW_AUDIO_CONNECTIONS':
                return state = action.payload;
            default:
                return state;
        }
    },
    showMidiConnections: (state = true, action) => {
        switch (action.type) {
            case 'SHOW_MIDI_CONNECTIONS':
                return state = action.payload;
            default:
                return state;
        }
    },
    makingConnection: (state = false, action) => {
        switch (action.type) {
            case 'MAKING_CONNECTION':
                return state = action.payload;
            default:
                return state;
        }
    },
    newConnectionPoints: (state = [0, 0, 0, 0], action) => {
        switch (action.type) {
            case 'NEW_CONNECTION_POINTS':
                return state = action.payload;
            default:
                return state;
        }
    }
}

export default workspaceReducers;