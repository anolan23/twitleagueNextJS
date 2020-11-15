const INITIAL_STATE = {
    watchers: [],
    events: [],
    image: "",
    banner: "",
    roster: []
}

const teamReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case "CREATE_TEAM":
            return action.payload;
        case "FETCH_TEAM":
            return action.payload;
        case "WATCH_TEAM":
            return {...state, watchers: action.payload.watchers}; 
        case "UNWATCH_TEAM":
            return {...state, watchers: action.payload.watchers};
        case "ADD_TEAM_EVENT":
            return {...state, events: action.payload};
        case "SAVE_TEAM_IMAGES":
            return {...state, image: action.payload.image, banner: action.payload.banner}
        default:
            return state;
    }
}

export default teamReducer;