export let initialState = {
    loggedIn: false,
    name: ""
};

function rootReducer(state = initialState, action){
    switch(action.type) {
        case "SET_LOGGED_IN":
            return {
                ...state,
                loggedIn: action.loggedIn
            };
        default:
            return state;
    }
}

export default rootReducer;
