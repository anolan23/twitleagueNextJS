const INITIAL_STATE = {};

export const themeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_THEME":
      return action.payload;
    default:
      return state;
  }
};

export default themeReducer;
