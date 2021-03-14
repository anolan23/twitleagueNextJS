const INITIAL_STATE = [];

const eventReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case "SET_EVENT":
            return action.payload;
        case "UPDATE_EVENT":
            return action.payload;
        default:
            return state;
    }
}

export default eventReducer;