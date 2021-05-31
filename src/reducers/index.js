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
  allStockDevices: deviceReducers.allStockDevices,
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
  deviceIdBeingEdited: adminConsoleReducers.deviceIdBeingEdited,
  gettingData: deviceReducers.gettingData,
  isVerified: authReducers.isVerified,
  isManageAccountPageOpen: authReducers.isManageAccountPageOpen,
  selectedLayoutDeviceId: workspaceReducers.selectedLayoutDeviceId,
  connectionSelections: workspaceReducers.connectionSelections,
  addDeviceFormValues: addDeviceReducers.addDeviceFormValues,
  currentStep: addDeviceReducers.currentStep,
  userData: deviceReducers.userData,
  deviceBeingEdited: deviceReducers.deviceBeingEdited,
  triggerStockDeviceHook: deviceReducers.triggerStockDeviceHook,
  connectionDevices: workspaceReducers.connectionDevices,
  chartData: workspaceReducers.chartData,
  selectedWorkspaceDeviceId: workspaceReducers.selectedWorkspaceDeviceId,
  drawing: workspaceReducers.drawing,
  connection: workspaceReducers.connection,
  availableConnectionIds: workspaceReducers.availableConnectionIds,
  stageScale: workspaceReducers.stageScale,
  showAudioConnections: workspaceReducers.showAudioConnections,
  showMidiConnections: workspaceReducers.showMidiConnections
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STATE') {
    state = undefined;
  }

  return allReducers(state, action);
};

export default rootReducer;