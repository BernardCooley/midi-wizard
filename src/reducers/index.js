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
    userDeviceIds: deviceReducers.userDeviceIds,
    userDevices: deviceReducers.userDevices,
    isAddDeviceFormOpen: deviceReducers.toggleAddDeviceForm,
    isDeviceTrayOpen: deviceReducers.isDeviceTrayOpen,
    isAdminConsoleOpen: adminConsoleReducers.isAdminConsoleOpen,
    workspaceDevices: workspaceDevices.getWorkspaceDevices,
    searchResults: deviceReducers.searchResults,
    selectedLayoutId: workspaceDevices.selectedLayoutId,
    layouts: workspaceDevices.layouts,
    currentLayout: workspaceDevices.currentLayout,
    layoutIds: workspaceDevices.layoutIds,
    isLayoutsTrayOpen: workspaceDevices.isLayoutsTrayOpen,
    deletedLayoutId: workspaceDevices.deletedLayoutId,
    toggleVarifiedDevices: adminConsoleReducers.toggleVarifiedDevices,
    toggleEditingImage: adminConsoleReducers.toggleEditingImage,
    deviceIdBeingEdited: adminConsoleReducers.deviceIdBeingEdited
});

export default allReducers;