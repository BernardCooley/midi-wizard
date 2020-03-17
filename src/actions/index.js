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