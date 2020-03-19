import authReducers from './authReducers';
import deviceReducers from './devicesReducers';
import adminConsoleReducers from './adminConsoleReducers';
import workspaceDevices from './wrokspaceReducers';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    isLoggedIn: authReducers.isLoggedInReducer,
    currentUserId: authReducers.currentUserIdReducer,
    currentUsername: authReducers.currentUsernameReducer,
    isLoginRegisterOpen: authReducers.toggleLoginRegister,
    isAdmin: authReducers.isAdmin,
    stockDevices: deviceReducers.stockDevices,
    userDevices: deviceReducers.userDevices,
    isAddDeviceFormOpen: deviceReducers.toggleAddDeviceForm,
    isDeviceTrayOpen: deviceReducers.isDeviceTrayOpen,
    isAdminConsoleOpen: adminConsoleReducers.isAdminConsoleOpen,
    workspaceDevices: workspaceDevices.getWorkspaceDevices
});

export default allReducers;