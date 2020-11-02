const INITIAL_STATE = {
    teams: []
}

const leagueReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
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