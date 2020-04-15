const authReducers = {
    isLoggedInReducer: (state = false, action) => {
        switch (action.type) {
            case 'IS_LOGGED_IN':
                return state = action.payload;
            default:
                return state;
        }
    },
    currentUserIdReducer: (state = '', action) => {
        switch (action.type) {
            case 'USER_ID':
                return state = action.payload;
            default:
                return state;
        }
    },
    currentUsernameReducer: (state = '', action) => {
        switch (action.type) {
            case 'USERNAME':
                return state = action.payload;
            default:
                return state;
        }
    },
    currentAuthComponent: (state = 'login', action) => {
        switch (action.type) {
            case 'CURRENT_AUTH_COMPONENT':
                return state = action.payload;
            default:
                return state;
        }
    },
    isAdmin: (state = false, action) => {
        switch (action.type) {
            case 'IS_ADMIN':
                return state = action.payload;
            default:
                return state;
        }
    },
    isVerified: (state = false, action) => {
        switch (action.type) {
            case 'IS_VERIFIED':
                return state = action.payload;
            default:
                return state;
        }
    },
    isManageAccountPageOpen: (state = false, action) => {
        switch (action.type) {
            case 'IS_MANAGE_ACCOUNT_PAGE_OPEN':
                return state = action.payload;
            default:
                return state;
        }
    }
}

export default authReducers;