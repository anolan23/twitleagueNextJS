const INITIAL_STATE = {
}

const leagueReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case "SET_LEAGUE":
            return action.payload;
        case "CREATE_LEAGUE":
            return action.payload;
        case "FETCH_LEAGUE":
            return action.payload;
        case "FETCH_LEAGUE_TEAMS":
            return {...state, teams: action.payload}
        default:
            return state;
    }
}

export default leagueReducer;