export const setIsLoggedIn = inOut => {
    return {
        type: 'IS_LOGGED_IN',
        payload: inOut
    };
};

export const setCurrentUserId = userId => {
    return {
        type: 'USER_ID',
        payload: userId
    };
};

export const setCurrentUsername = username => {
    return {
        type: 'USERNAME',
        payload: username
    };
};

export const setStockDevices = stockDevices => {
    return {
        type: 'STOCK_DEVICES',
        payload: stockDevices
    };
};

export const allStockDevices = stockDevices => {
    return {
        type: 'ALL_STOCK_DEVICES',
        payload: stockDevices
    };
};

export const setUserDevicIds = userDeviceIds => {
    return {
        type: 'USER_DEVICE_IDS',
        payload: userDeviceIds
    };
};

export const setUserDevices = userDevices => {
    return {
        type: 'USER_DEVICES',
        payload: userDevices
    };
};

export const existingUserDevices = userDevices => {
    return {
        type: 'NEW_USER_DEVICES',
        payload: userDevices
    };
};

export const toggleAddDeviceForm = show => {
    return {
        type: 'ADD_DEVICE_FORM',
        payload: show
    };
};

export const isDeviceTrayOpen = () => {
    return {
        type: 'IS_DEVICE_TRAY_OPEN'
    };
};

export const currentAuthComponent = componentName => {
    return {
        type: 'CURRENT_AUTH_COMPONENT',
        payload: componentName
    };
};

export const isAdmin = isAdmin => {
    return {
        type: 'IS_ADMIN',
        payload: isAdmin
    };
};

export const toggleAdminConsole = show => {
    return {
        type: 'IS_ADMIN_CONSOLE_OPEN',
        payload: show
    };
};

export const getWorkspaceDevices = devices => {
    return {
        type: 'GET_WORKSPACE_DEVICES',
        payload: devices
    };
};

export const setSearchResults = results => {
    return {
        type: 'SEARCH_RESULTS',
        payload: results
    };
};

export const selectedLayoutId = id => {
    return {
        type: 'GET_LAYOUT_ID',
        payload: id
    };
};

export const layouts = layouts => {
    return {
        type: 'LAYOUTS',
        payload: layouts
    };
};

export const layoutIds = layoutIds => {
    return {
        type: 'LAYOUT_IDS',
        payload: layoutIds
    };
};

export const currentLayout = layout => {
    return {
        type: 'CURRENT_LAYOUT',
        payload: layout
    };
};

export const isLayoutsTrayOpen = () => {
    return {
        type: 'IS_LAYOUTS_TRAY_OPEN'
    };
};

export const deletedLayoutId = layoutId => {
    return {
        type: 'DELETED_LAYOUT_ID',
        payload: layoutId
    };
};

export const toggleVarifiedDevices = () => {
    return {
        type: 'TOGGLE_VERIFIED_DEVICES'
    };
};

export const toggleEditingImage = edtingImage => {
    return {
        type: 'TOGGLE_EDITING_IMAGE',
        payload: edtingImage
    };
};

export const deviceIdBeingEdited = id => {
    return {
        type: 'DEVICE_ID_BEING_EDITED',
        payload: id
    };
};

export const gettingData = isGettingData => {
    return {
        type: 'GETTING_DATA',
        payload: isGettingData
    };
};

export const resetState = () => {
    return {
        type: 'RESET_STATE'
    };
};

export const isVerified = isVerified => {
    return {
        type: 'IS_VERIFIED',
        payload: isVerified
    };
};

export const isManageAccountPageOpen = isManageAccountPageOpen => {
    return {
        type: 'IS_MANAGE_ACCOUNT_PAGE_OPEN',
        payload: isManageAccountPageOpen
    };
};

export const selectedLayoutDeviceId = ID => {
    return {
        type: 'SELECTED_LAYOUT_DEVICE_ID',
        payload: ID
    };
};

export const connectionSelections = selection => {
    return {
        type: 'CONNECTION_SELECTIONS',
        payload: selection
    };
};

export const addDeviceFormValues = formValues => {
    return {
        type: 'ADD_DEVICE_FORM_VALUES',
        payload: formValues
    };
};

export const currentStep = stepNumber => {
    return {
        type: 'CURRENT_STEP',
        payload: stepNumber
    };
};

