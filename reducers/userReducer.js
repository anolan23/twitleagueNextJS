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
        case "FOLLOW_TEAM":
            return {...state, following: [...state.following, action.payload]};
        case "UNFOLLOW_TEAM":
            return {...state, watchList: action.payload.watchList}; 
        case "FETCH_NOTIFICATIONS":
            return {...state, notifications: action.payload};
        case "FETCH_TEAMS":
            return {...state, teams: action.payload};
        case "FETCH_LEAGUES":
            return {...state, leagues: action.payload};
        case "UPDATE_USER_PROFILE":
            return action.payload;        
        default:
            return state;
    }
}

export default userReducer;