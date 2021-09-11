import themeReducer from "./themeReducer";
import playoffReducer from "./playoffsReducer";
import alertsReducer from "./alertsReducer";

const combineReducers = (slices) => (state, action) =>
  Object.keys(slices).reduce(
    (acc, prop) => ({
      ...acc,
      [prop]: slices[prop](acc[prop], action),
    }),
    state
  );

export default combineReducers({
  theme: themeReducer,
  playoffs: playoffReducer,
  alerts: alertsReducer,
});
