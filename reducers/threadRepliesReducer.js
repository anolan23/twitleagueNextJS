const INITIAL_STATE = [];

const threadRepliesReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case "FETCH_REPLIES":
            return action.payload;
        case "CREATE_REPLY":
            let replies = [...state];
            replies.unshift(action.payload);
            return replies;
        case "CLEAR_REPLIES":
            return action.payload;
        default:
            return state;
    }
}

export default threadRepliesReducer;