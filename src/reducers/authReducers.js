const authReducers = {
    isLoggedInReducer: (state = false, action) => {
        switch(action.type) {
            case 'IS_LOGGED_IN':
                return state = action.payload;
            default:
                return state;
        }
    },
    currentUserIdReducer: (state = '', action) => {
        switch(action.type) {
            case 'USER_ID':
                return state = action.payload;
            default:
                return state;
        }
    },
    currentUsernameReducer: (state = '', action) => {
        switch(action.type) {
            case 'USERNAME':
                return state = action.payload;
            default:
                return state;
        }
    },
    toggleLoginRegister: (state = false, action) => {
        switch(action.type) {
            case 'TOGGLE_LOGIN_REGISTER':
                return state = action.payload;
            default:
                return state;
        }
    },
    isAdmin: (state = false, action) => {
        switch(action.type) {
            case 'IS_ADMIN':
                return state = action.payload;
            default:
                return state;
        }
    }
}

export default authReducers;