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
    const response = await backend.get("/api/users");
    dispatch({type: "FETCH_USER", payload: response.data})
}

export const loginUser = formValues => async dispatch => {
    const response = await backend.post("/api/login", formValues);

    dispatch({type: "LOGIN_USER", payload: response.data});
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
    const response = await backend.patch("/api/users", {
        userId,
        values
    });

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

export const toggleSignupPopup = () => {
    return {type: "TOGGLE_SIGNUP_POPUP"};
}



export const toggleEditProfilePopup = () => (dispatch, getState) => {
    dispatch({type: "TOGGLE_EDIT_PROFILE_MODAL"});
}

export const toggleEditTeamPopup = () => (dispatch) => {
        dispatch({type: "TOGGLE_EDIT_TEAM_MODAL"});
}

export const toggleEditRosterPopup = () => (dispatch) => {
        dispatch({type: "TOGGLE_EDIT_ROSTER_POPUP"});
}

export const toggleEditEventsPopup = () => (dispatch) => {
        dispatch({type: "TOGGLE_EDIT_EVENTS_POPUP"});
}

export const togglePanel = () => {
    return {type: "TOGGLE_PANEL"};
}

//Team Action Creators

export const setTeam = team => (dispatch) => {
    dispatch({type: "SET_TEAM", payload: team})
}

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

export const fetchUserTeams = () => async (dispatch, getState) => {
    const user = getState().user;
    if(!user.isSignedIn){
        return;
    }
    const response = await backend.get("/api/teams", {
        params: {
            ownerId: user.id
        }
    });
    
    dispatch({type: "FETCH_USER_TEAMS", payload: response.data})
}

export const fetchTeamAndTeamPosts = (teamAbbrev) => async (dispatch) => {
    await dispatch(fetchTeam(teamAbbrev));
    dispatch(fetchTeamPosts(teamAbbrev));
}

export const findEventsByTeamId = async teamId => {
    const response = await backend.get("/api/teams/events", {
        params:{
            teamId
        }  
});
    return response.data;
}

export const addTeamEventAndFetchTeam = (values) => async (dispatch, getState) => {
    const teamAbbrev = getState().team.teamAbbrev.substring(1);
    await dispatch(addTeamEvent(values));
    dispatch(fetchTeam(teamAbbrev));
}

export const saveTeamImages = (teamImageUrl, bannerImageUrl) => async (dispatch, getState) => {
    const state = getState();
    const userId = state.user._id;
    const owner = state.team.owner;
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

export const followTeam =  async (userId, teamId) => {
    if(userId && teamId){
        const response = await backend.patch("/api/followers", {userId, teamId});
    }
}

export const unFollowTeam =  async (userId, teamId) => {
    if(userId && teamId){
        const response = await backend.delete("/api/followers", {
            params:{
                userId, 
                teamId
            }
        });
    }
}

export const watchTeamAndFetchUser = () => async (dispatch) => {
   await dispatch(followTeam());
   dispatch(fetchUser());
}

export const unwatchTeam = () => async (dispatch, getState) => {
    const state = getState();
    const userId = state.user._id;
    const teamId = state.team._id;
    if(userId && teamId){
        const response = await backend.patch("/unwatch", {userId,teamId});
        dispatch({type: "UNFOLLOW_TEAM", payload: response.data});
    }
}

export const unwatchTeamAndFetchUser = () => async (dispatch) => {
    await dispatch(unwatchTeam());
    dispatch(fetchUser());
 }

export const sendJoinTeamInvite = (recipient, teamId) => async () => {
    backend.post("/api/notifications", {
        userId: recipient,
        type: "Join Team Invite",
        teamId
    });
} 

export const updateTeamProfile = (values) => async (dispatch, getState) => {
    const state = getState();
    const userId = state.user.id;
    const ownerId = state.team.owner_id;
    const teamId = state.team.id;
    if(ownerId === userId){
        const response = await backend.patch("/api/teams", {
            teamId,
            values
        });
    
        dispatch({type: "UPDATE_TEAM_PROFILE", payload: response.data}) 
    }
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

export const fetchLeague = async (leagueName) => {
    const league = await backend.get(`/api/leagues/${leagueName}`);
    return league.data; 
}

export const fetchLeagues =  async (userId) => {
    const leagues = await backend.get("/api/leagues", {
        params: {
            ownerId: userId
        }
    });
    return leagues.data
}

export const setLeague = league => (dispatch) => {
    dispatch({type: "SET_LEAGUE", payload: league})
}

//Posts Action Creators
export const createPost = () => async (dispatch, getState) => {
    const state = getState();
    const userId = state.user.id;
    const body = state.post.body;
    const gif = state.post.gif;
    const outlook = state.post.outlook;
    const post = {userId, body, gif, outlook}
    const response = await backend.post("/api/posts", post);

    dispatch({type: "CREATE_POST", payload: response.data})
    dispatch(emptyPostData());
}

export const createReply = (conversation_id, in_reply_to_post_id) => async (dispatch, getState) => {
    const state = getState();
    const userId = state.user.id;
    const body = state.post.body;
    const gif = state.post.gif;
    const outlook = state.post.outlook;
    const reply = {userId, body, gif, outlook, conversation_id, in_reply_to_post_id};
    const response = await backend.post("/api/posts", {reply});

    dispatch({type: "CREATE_REPLY", payload: response.data})
    dispatch(emptyPostData());
}

export const fetchTeamPosts = (teamId) => async (dispatch, getState) => {
    const userId = getState().user.id;
    const response = await backend.get("/api/posts/team", {
        params: {
            userId,
            teamId
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

export const fetchPosts = (num, offset) => async (dispatch, getState) => {
        const userId = getState().user.id;
        const response = await backend.get("/api/posts", {
            params: {
                userId,
                num,
                offset
            }
        });
        dispatch({type: "FETCH_POSTS", payload: response.data});
}

export const fetchUserPosts = (targetUserId, userId, num, offset) => async (dispatch) => {
    const response = await backend.get("/api/posts/user", {
        params: {
            targetUserId,
            userId,
            num,
            offset
        }
    });
    dispatch({type: "FETCH_USER_POSTS", payload: response.data});
}

export const fetchLeaguePosts = (leagueId) => async (dispatch) => {
    const response = await backend.get("/api/posts/league", {
        params: {
            leagueId: leagueId
        }
    });
    
    dispatch({type: "FETCH_LEAGUE_POSTS", payload: response.data});
}

export const fetchThreadPosts = (postId) => async (dispatch, getState) => {
    const userId = getState().user.id;
    const response = await backend.get("/api/posts/thread", {
        params: {
            userId,
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

    const posts = getState().posts;
    let newPosts = posts.map(post => {
        let temp = Object.assign({}, post);
        if(temp.id === postId){
            temp.liked = true;
            temp.likes++;
        }
        return temp;
    })

    dispatch({type: "LIKE_POST", payload: newPosts})
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
    dispatch({type: "CLEAR_POSTS", payload: null});
}

//Post Action Creators
export const saveCurrentPostText = (body) => {
    return {type: "SAVE_CURRENT_BODY", payload: body};
}

export const saveCurrentPostGif = (gif) => {
    return {type: "SAVE_CURRENT_POST_GIF", payload: gif};
}

export const closeGif = () => {
    return {type: "CLOSE_GIF"};
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
    dispatch({type: "FETCH_NOTIFICATIONS", payload: response.data})
}











