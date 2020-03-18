import authReducers from './authReducers';
import deviceReducers from './devicesReducers';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    isLoggedIn: authReducers.isLoggedInReducer,
    currentUserId: authReducers.currentUserIdReducer,
    currentUsername: authReducers.currentUsernameReducer,
    isLoginRegisterOpen: authReducers.toggleLoginRegister,
    stockDevices: deviceReducers.stockDevices,
    userDevices: deviceReducers.userDevices,
    isAddDeviceFormOpen: deviceReducers.toggleAddDeviceForm,
    isDeviceTrayOpen: deviceReducers.isDeviceTrayOpen
});

export default allReducers;