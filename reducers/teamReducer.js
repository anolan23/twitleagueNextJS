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
        case "FOLLOW_TEAM":
            return {...state, followers: [...state.followers, action.payload]}; 
        case "UNFOLLOW_TEAM":
            return {...state, following: action.payload};
        case "ADD_TEAM_EVENT":
            return {...state, events: action.payload};
        case "SAVE_TEAM_IMAGES":
            return {...state, image: action.payload.image, banner: action.payload.banner}
        default:
            return state;
    }
}

export default teamReducer;