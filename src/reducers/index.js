import authReducers from './authReducers';
import deviceReducers from './devicesReducers';
import adminConsoleReducers from './adminConsoleReducers';
import workspaceDevices from './workspaceReducers';
import { combineReducers } from 'redux';
import workspaceReducers from './workspaceReducers';
import addDeviceReducers from './addDeviceReducers';

const allReducers = combineReducers({
  isLoggedIn: authReducers.isLoggedInReducer,
  currentUserId: authReducers.currentUserIdReducer,
  currentUsername: authReducers.currentUsernameReducer,
  currentAuthComponent: authReducers.currentAuthComponent,
  isAdmin: authReducers.isAdmin,
  stockDevices: deviceReducers.stockDevices,
  allStockDevices: deviceReducers.allStockDevices,
  userDeviceIds: deviceReducers.userDeviceIds,
  userDevices: deviceReducers.userDevices,
  existingUserDevices: deviceReducers.existingUserDevices,
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
  deviceIdBeingEdited: adminConsoleReducers.deviceIdBeingEdited,
  gettingData: deviceReducers.gettingData,
  isVerified: authReducers.isVerified,
  isManageAccountPageOpen: authReducers.isManageAccountPageOpen,
  selectedLayoutDeviceId: workspaceReducers.selectedLayoutDeviceId,
  connectionSelections: workspaceReducers.connectionSelections,
  addDeviceFormValues: addDeviceReducers.addDeviceFormValues,
  currentStep: addDeviceReducers.currentStep
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STATE') {
    state = undefined;
  }

  return allReducers(state, action);
};

export default rootReducer;