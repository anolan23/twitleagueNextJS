const INITIAL_STATE = {
    body: "",
    gif: null,
    outlook: null
}

const postReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case "SAVE_CURRENT_BODY":
            return {...state, body: action.payload}
        case "SAVE_CURRENT_POST_GIF":
            return {...state, gif: action.payload}
        case "SAVE_CURRENT_OUTLOOK":
            return {...state, outlook: action.payload}
        case "EMPTY_POST_DATA":
            return INITIAL_STATE;
        case "CLOSE_GIF":
            return {...state, gif: null};
        default:
            return state;
    }
}

export default postReducer;
