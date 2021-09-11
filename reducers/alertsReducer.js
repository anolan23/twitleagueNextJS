const INITIAL_STATE = [];

const alertsReducer = (state = INITIAL_STATE, action) => {
  const { index, message, href, duration } = action;
  switch (action.type) {
    case "ADD_ALERT":
      return [...state, { message, href, duration }];
    case "REMOVE_ALERT":
      return state.filter((alert, alertIndex) => {
        if (alertIndex === index) return false;
        else return true;
      });
    default:
      return state;
  }
};

export default alertsReducer;
