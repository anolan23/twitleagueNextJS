const INITIAL_STATE = {};

const playoffReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_PLAYOFFS":
      return action.payload;
    case "SET_BRACKET":
      return { ...state, bracket: action.payload };
    case "SET_SEEDS":
      return { ...state, seeds: action.payload };
    case "SET_STATUS":
      return { ...state, in_progress: action.payload };
    case "SET_CHAMPION":
      return { ...state, champion: action.payload };
    default:
      return state;
  }
};

export default playoffReducer;
