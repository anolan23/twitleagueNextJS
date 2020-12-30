const INITIAL_STATE = [];

const postsReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case "CREATE_POST":
            return [...state, action.payload]; 
        case "FETCH_TEAM_POSTS":
            return action.payload; 
        case "LIKE_POST":
            return action.payload;
        case "UNLIKE_POST":
            return {...state, [state._id]: {...state._id,likes: action.payload}}
        case "CREATE_COMMENT_ON_POST":
            return {...state, [action.payload.parentPostId]: {...state[action.payload.parentPostId],comments: action.payload.comments}}
        case "FETCH_WATCHLIST_POSTS":
            return action.payload;
        case "FETCH_TRENDING_POSTS":
            return action.payload;
        case "FETCH_LEAGUE_POSTS":
            return action.payload;
        case "FETCH_THREAD_POSTS":
            return action.payload;
        case "CLEAR_POSTS":
            return action.payload;
        default:
        return state;
    }
}

export default postsReducer;
