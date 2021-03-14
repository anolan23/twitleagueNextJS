import {combineReducers} from "redux";
import userReducer from "./userReducer";
import modalReducer from "./modalReducer";
import teamReducer from "./teamReducer";
import leagueReducer from "./leagueReducer";
import postsReducer from "./postsReducer";
import trackedPostReducer from "./trackedPostReducer";
import eventReducer from "./eventReducer";

export default combineReducers({
    user: userReducer,
    team: teamReducer,
    event: eventReducer,
    league: leagueReducer,
    posts: postsReducer,
    modals: modalReducer,
    trackedPost: trackedPostReducer
});