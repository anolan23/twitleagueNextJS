import {combineReducers} from "redux";
import userReducer from "./userReducer";
import modalReducer from "./modalReducer";
import teamReducer from "./teamReducer";
import leagueReducer from "./leagueReducer";
import postsReducer from "./postsReducer";
import postReducer from "./postReducer";
import trackedPostReducer from "./trackedPostReducer";

export default combineReducers({
    user: userReducer,
    team: teamReducer,
    league: leagueReducer,
    posts: postsReducer,
    post: postReducer,
    modals: modalReducer,
    trackedPost: trackedPostReducer
});