import authReducers from './authReducers';
import deviceReducers from './devicesReducers';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    isLoggedIn: authReducers.isLoggedInReducer,
    currentUserId: authReducers.currentUserIdReducer,
    currentUsername: authReducers.currentUsernameReducer,
    stockDevices: deviceReducers.stockDevices,
    userDevices: deviceReducers.userDevices
});

export default allReducers;