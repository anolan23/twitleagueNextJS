import { useEffect } from "react";
import { bindActionCreators } from "redux";
import backend from "../lib/backend";

//User Action Creators
export const createUser = formValues => async dispatch => {
    const response = await backend.post("/api/signup", formValues);

    dispatch({type: "CREATE_USER", payload: response.data});
    dispatch(toggleSignUpModal());
}

export const fetchUser = () => async dispatch => {
    const response = await backend.get("/api/user");
    dispatch({type: "FETCH_USER", payload: response.data})
}

export const loginUser = formValues => async dispatch => {
    const response = await backend.post("/api/login", formValues);

    dispatch({type: "LOGIN_USER", payload: response.data})
    dispatch(toggleLoginModal());
}

export const logOutUser = () => async dispatch => {
    const response = await backend.get("/api/logout");

    dispatch({type: "LOGOUT_USER", payload: response.data})
}

export const deleteNotification = notificationId => async (dispatch, getState) => {
    let notifications = getState().user.notifications;
    notifications = notifications.filter(notification => {
        return notification.id !== notificationId;
    });
    dispatch({type: "DELETE_NOTIFICATION", payload: notifications});
    backend.delete("/api/notifications", {
        params: {
            notificationId
        }                     
    });
}

export const updateUserProfile = (values) => async (dispatch, getState) => {
    const userId = getState().user.id;
    if(!userId){
        return;
    }
    const response = await backend.patch("/api/user", {
        userId,
        values
    });
    console.log(response.data)

    dispatch({type: "UPDATE_USER_PROFILE", payload: response.data})
}

//Modal Action Creators
export const toggleSignUpModal = () => {
    return {type: "TOGGLE_SIGNUP_MODAL"};
}

export const toggleLoginModal = () => {
    return {type: "TOGGLE_LOGIN_MODAL"};
}

export const toggleCreateTeamModal = () => {
    return {type: "TOGGLE_CREATE_TEAM_MODAL"};
}

export const toggleCreateLeagueModal = () => {
    return {type: "TOGGLE_CREATE_LEAGUE_MODAL"};
}

export const toggleGifPopup = () => {
    return {type: "TOGGLE_GIF_POPUP"};
}

export const togglePostModal = () => {
    return {type: "TOGGLE_POST_MODAL"};
}

export const toggleAddEventModal = () => {
    return {type: "TOGGLE_ADDEVENT_MODAL"};
}

export const toggleScheduleModal = () => {
    return {type: "TOGGLE_SCHEDULE_MODAL"};
}

export const toggleRosterModal = () => {
    return {type: "TOGGLE_ROSTER_MODAL"};
}

export const togglePopupCompose = () => {
    return {type: "TOGGLE_POPUP_COMPOSE"};
}

export const togglePopupReply = () => {
    return {type: "TOGGLE_POPUP_REPLY"};
}



export const toggleEditProfilePopup = () => (dispatch, getState) => {
    const userId = getState().user._id;
    const owner = getState().team.owner;
    if(owner === userId){
        dispatch({type: "TOGGLE_EDIT_PROFILE_MODAL"});
    }
}

//Team Action Creators
export const createTeam = formValues => async (dispatch, getState) => {
    const owner = getState().user.id;
    const response = await backend.post("api/teams", {...formValues, owner: owner});

    // dispatch({type: "CREATE_TEAM", payload: response.data})
}

export const createTeamAndFetchUser = (formValues) => async (dispatch) => {
    await dispatch(createTeam(formValues));
    dispatch(fetchUser());
}

export const fetchTeam = (teamAbbrev) => async dispatch => {
    const response = await backend.get(`/api/teams/${teamAbbrev}`);
    
    dispatch({type: "FETCH_TEAM", payload: response.data})
}

export const fetchTeams = () => async (dispatch, getState) => {
    const user = getState().user;
    if(!user.isSignedIn){
        return;
    }
    const response = await backend.get("/api/teams", {
        params: {
            ownerId: user.id
        }
    });
    
    dispatch({type: "FETCH_TEAMS", payload: response.data})
}

export const fetchTeamAndTeamPosts = (teamAbbrev) => async (dispatch) => {
    await dispatch(fetchTeam(teamAbbrev));
    dispatch(fetchTeamPosts(teamAbbrev));
}

export const addTeamEvent = values => async (dispatch, getState) => {
    const userId = getState().user._id;
    const team = getState().team;
    const owner = team.owner;
    const teamAbbrev = team.teamAbbrev.substring(1);
    const opponents = team.opponents; //Array of teams in league
    
    const opponent = opponents.find(opponent => opponent.teamAbbrev === values.opponent);
    if(owner === userId){
        const response = await backend.post(`api/events/team/${teamAbbrev}`, {
            values: {...values, opponent: opponent._id}
        });
        dispatch({type:"ADD_TEAM_EVENT", payload: response.data});
    }
    else{
        console.error("owner !== userId");
    }
}

export const addTeamEventAndFetchTeam = (values) => async (dispatch, getState) => {
    const teamAbbrev = getState().team.teamAbbrev.substring(1);
    await dispatch(addTeamEvent(values));
    dispatch(fetchTeam(teamAbbrev));
}

export const saveTeamImages = (teamImageUrl, bannerImageUrl) => async (dispatch, getState) => {
    const userId = getState().user._id;
    const owner = getState().team.owner;
    const teamAbbrev = getState().team.teamAbbrev.substring(1);
    if(owner === userId){
        const response = await backend.patch(`api/teams/${teamAbbrev}`, {
                teamImageUrl,
                bannerImageUrl
        });
        dispatch({type:"SAVE_TEAM_IMAGES", payload: response.data});
    }
    else{
        console.error("owner !== userId");
    }
}

export const followTeam = () => async (dispatch, getState) => {
    const userId = getState().user.id;
    const teamId = getState().team.id;
    if(userId && teamId){
        const response = await backend.patch("/api/follow/team", {userId,teamId});
        dispatch({type: "FOLLOW_TEAM", payload: response.data});
    }
}

export const watchTeamAndFetchUser = () => async (dispatch) => {
   await dispatch(followTeam());
   dispatch(fetchUser());
}

export const unwatchTeam = () => async (dispatch, getState) => {
    const userId = getState().user._id;
    const teamId = getState().team._id;
    if(userId && teamId){
        const response = await backend.patch("/unwatch", {userId,teamId});
        dispatch({type: "UNFOLLOW_TEAM", payload: response.data});
    }
}

export const unwatchTeamAndFetchUser = () => async (dispatch) => {
    await dispatch(unwatchTeam());
    dispatch(fetchUser());
 }

export const sendJoinTeamRequest = () => async (dispatch, getState) => {
    const teamId = getState().team._id;
    const userId = getState().user._id;
    backend.patch("/api/user/notifications", {
        notificationType: "Join Team Request",
        teamId,
        userId
    });
} 

//League Action Creators
export const createLeague = formValues => async (dispatch, getState) => {
    const ownerId = getState().user.id;
    backend.post("/api/leagues", {...formValues, ownerId});
}

export const createLeagueAndFetchUser = (formValues) => async (dispatch) => {
    await dispatch(createLeague(formValues));
    dispatch(fetchUser());
}

export const fetchLeague = (leagueName) => async dispatch => {
    const response = await backend.get(`/api/leagues/${leagueName}`);
    
    dispatch({type: "FETCH_LEAGUE", payload: response.data})
}

export const fetchLeagues = () => async (dispatch, getState) => {
    const user = getState().user;
    if(!user.isSignedIn){
        return;
    }
    const response = await backend.get("/api/leagues", {
        params: {
            ownerId: user.id
        }
    });
    
    dispatch({type: "FETCH_LEAGUES", payload: response.data})
}

//Posts Action Creators
export const createPost = () => async (dispatch, getState) => {
    const userId = getState().user.id;
    const body = getState().post.postText;
    const gif = getState().post.gif.id;
    const outlook = getState().post.outlook;
    const post = {userId, body, gif, outlook}
    const response = await backend.post("/api/posts", post);

    dispatch({type: "CREATE_POST", payload: response.data})
    dispatch(emptyPostData());
}

export const createReply = (conversation_id, in_reply_to_post_id) => async (dispatch, getState) => {
    const userId = getState().user.id;
    const body = getState().post.postText;
    const gif = getState().post.gif.id;
    const outlook = getState().post.outlook;
    const reply = {userId, body, gif, outlook, conversation_id, in_reply_to_post_id};
    const response = await backend.post("/api/posts", {reply});

    dispatch({type: "CREATE_REPLY", payload: response.data})
    dispatch(emptyPostData());
}

export const fetchTeamPosts = () => async (dispatch, getState) => {
    const teamId = getState().team.id;
    const response = await backend.get("/api/posts/team", {
        params: {
            teamId: teamId
        }
    });
    
    dispatch({type: "FETCH_TEAM_POSTS", payload: response.data})
}

export const fetchWatchListPosts = () => async (dispatch, getState) => {
    const watchList = getState().user.watchList;
    if(watchList){
        const response = await backend.get("api/posts/watchlist", {
            params: {
                watchList
            }
        });
        
        dispatch({type: "FETCH_WATCHLIST_POSTS", payload: response.data})
    }
}

export const fetchPosts = (num, offset) => async (dispatch) => {
        const response = await backend.get("/api/posts", {
            params: {
                num,
                offset
            }
        });
        dispatch({type: "FETCH_POSTS", payload: response.data});
}

export const fetchUserPosts = (userId, num, offset) => async (dispatch) => {
    const response = await backend.get("/api/posts", {
        params: {
            userId,
            num,
            offset
        }
    });
    dispatch({type: "FETCH_USER_POSTS", payload: response.data});
}

export const fetchLeaguePosts = () => async (dispatch, getState) => {
    const leagueId = getState().team.league_id;
    const response = await backend.get("/api/posts/league", {
        params: {
            leagueId: leagueId
        }
    });
    
    dispatch({type: "FETCH_LEAGUE_POSTS", payload: response.data});
}

export const fetchThreadPosts = (postId) => async (dispatch) => {
    const response = await backend.get("/api/posts/thread", {
        params: {
            postId
        }
    });
    
    dispatch({type: "FETCH_THREAD_POSTS", payload: response.data});
}

export const fetchUserAndWatchListPosts = () => async (dispatch) => {
    await dispatch(fetchUser());
    dispatch(fetchWatchListPosts());
}



export const likePost = (postId) => async (dispatch, getState) => {
    const userId = getState().user.id;
    if(!userId){
        return;
    }

    let posts = getState().posts;
    const postIndex = posts.findIndex( post => post.id === postId)
    console.log("postIndex", postIndex)
    let likes = posts[postIndex].likes;
    likes++;
    posts[postIndex].likes = likes;
    dispatch({type: "LIKE_POST", payload: posts})
    const response = await backend.patch("/api/posts/like", {
        postId,
        userId
    });
}

export const unlikePost = (postId) => async (dispatch) => {
    const response = await backend.patch("/api/posts/like", {
        params: {
            postId
        }
    });

    dispatch({type: "UNLIKE_POST", payload: response.data})
}

export const clearPosts = () => async (dispatch) => {
    dispatch({type: "CLEAR_POSTS", payload: []});
}

//Post Action Creators
export const saveCurrentPostText = (postText) => {
    return {type: "SAVE_CURRENT_POST_TEXT", payload: postText};
}

export const saveCurrentPostGif = (gif) => {
    return {type: "SAVE_CURRENT_POST_GIF", payload: gif};
}

export const saveCurrentOutlook = (outlook) => {
    return {type: "SAVE_CURRENT_OUTLOOK", payload: outlook};
}

export const emptyPostData = () => {
    return {type: "EMPTY_POST_DATA"};
}

//Tracked Post Action Creators
export const trackClickedPost = (post) => {
    return {type: "TRACK_CLICKED_POST", payload: post};
}

//Notifications Action Creators
export const fetchNotifications = () => async (dispatch, getState) => {
    const user = getState().user;
    if(!user.isSignedIn){
        return;
    }
    const response = await backend.get("/api/notifications", {
        params: {
            userId: user.id
        }
    });
    console.log("response", response);
    dispatch({type: "FETCH_NOTIFICATIONS", payload: response.data})
}











