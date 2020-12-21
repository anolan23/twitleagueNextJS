const INITIAL_STATE = {
    isSignedIn: null,
    teams: [],
    leagues: []
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
        case "FETCH_NOTIFICATIONS":
            return {...state, notifications: action.payload};
        case "FETCH_TEAMS":
            return {...state, teams: action.payload};
        case "FETCH_LEAGUES":
            return {...state, leagues: action.payload};
        
        default:
            return state;
    }
}

export default userReducer;