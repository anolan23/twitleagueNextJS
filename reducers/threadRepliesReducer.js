const INITIAL_STATE = [];

const threadRepliesReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case "FETCH_REPLIES":
            return action.payload;
        case "CLEAR_REPLIES":
            return action.payload;
        default:
            return state;
    }
}

export default threadRepliesReducer;