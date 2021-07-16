const INITIAL_STATE = {};

const playoffReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_PLAYOFFS":
      return action.payload;
    default:
      return state;
  }
};

export default playoffReducer;
