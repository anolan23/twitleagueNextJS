const INITIAL_STATE = [];

const eventReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case "SET_EVENT":
            return action.payload;
        case "UPDATE_EVENT":
            let event = {...state};
            Object.assign(event, action.payload)
            return event;
        case "APPROVE_EVENT":
            return {...state, league_approved: true};
        default:
            return state;
    }
}

export default eventReducer;