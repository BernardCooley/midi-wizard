const adminConsoleReducers = {
    isAdminConsoleOpen: (state = false, action) => {
        switch(action.type) {
            case 'IS_ADMIN_CONSOLE_OPEN':
                return state = action.payload;
            default:
                return state;
        }
    }
}

export default adminConsoleReducers;