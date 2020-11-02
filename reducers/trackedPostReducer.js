const INITIAL_STATE = {}

const trackedPostReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case "TRACK_CLICKED_POST":
            return action.payload
        default:
            return state;
    }
}

export default trackedPostReducer;
