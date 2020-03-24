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

export const setUserDevices = userDevices => {
    return {
        type: 'USER_DEVICES',
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

export const toggleLoginRegister = show => {
    return {
        type: 'TOGGLE_LOGIN_REGISTER',
        payload: show
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