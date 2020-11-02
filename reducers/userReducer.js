const INITIAL_STATE = {
    isSignedIn: null,
    leagues: {},
    teams: {},
    notifications: [],
    watchList: [],
    watchListTeams: []
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case "CREATE_USER":
            return action.payload;
        case "FETCH_USER":
            return action.payload;
        case "LOGIN_USER":
            return action.payload;
        case "LOGOUT_USER":
            return action.payload; 
        case "DELETE_NOTIFICATION":
            return {...state, notifications: action.payload};
        case "WATCH_TEAM":
            return {...state, watchList: action.payload.watchList}; 
        case "UNWATCH_TEAM":
            return {...state, watchList: action.payload.watchList}; 
        default:
            return state;
    }
}

export default userReducer;