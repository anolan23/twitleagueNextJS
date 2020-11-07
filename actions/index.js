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

export const deleteNotification = indexToDelete => async (dispatch, getState) => {
    const userId = getState().user._id;
    console.log(userId);
    const response = await backend.delete("/notifications", {
                    params: {
                        userId, 
                        indexToDelete
                    }                     
    });
    
    dispatch({type: "DELETE_NOTIFICATION", payload: response.data}); 
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

export const toggleGifModal = () => {
    return {type: "TOGGLE_GIF_MODAL"};
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


export const toggleAvatarModal = () => (dispatch, getState) => {
    const userId = getState().user._id;
    const owner = getState().team.owner;
    if(owner === userId){
        dispatch({type: "TOGGLE_AVATAR_MODAL"});
    }
}

//Team Action Creators
export const createTeam = formValues => async (dispatch, getState) => {
    const owner = getState().user._id;
    const response = await backend.post("api/team", {...formValues, owner: owner});

    dispatch({type: "CREATE_TEAM", payload: response.data})
    dispatch(toggleCreateTeamModal());
}

export const createTeamAndFetchUser = (formValues) => async (dispatch) => {
    await dispatch(createTeam(formValues));
    dispatch(fetchUser());
}

export const fetchTeam = (teamAbbrev) => async dispatch => {
    const response = await backend.get(`/api/team/${teamAbbrev}`);
    
    dispatch({type: "FETCH_TEAM", payload: response.data})
}

export const fetchTeamAndTeamPosts = (teamAbbrev) => async (dispatch) => {
    await dispatch(fetchTeam(teamAbbrev));
    dispatch(fetchTeamPosts(teamAbbrev));
}

export const addTeamEvent = values => async (dispatch, getState) => {
    const userId = getState().user._id;
    const owner = getState().team.owner;
    const teamId = getState().team._id;
    const opponents = getState().team.opponents; //Array of teams in league
    console.log("values", values)
    const opponent = opponents.find(opponent => opponent.teamAbbrev === values.opponent);
    console.log(opponent);
    if(owner === userId){
        const response = await backend.post("/team/event", {
            teamId,
            values: {...values, opponent: opponent._id}
        });
        dispatch({type:"ADD_TEAM_EVENT", payload: response.data});
    }
    else{
        console.error("owner !== userId");
    }
}

export const addTeamEventAndFetchTeam = (values) => async (dispatch, getState) => {
    const teamId = getState().team._id;
    await dispatch(addTeamEvent(values));
    dispatch(fetchTeam(teamId));
}

export const saveTeamImage = imageUrl => async (dispatch, getState) => {
    const userId = getState().user._id;
    const owner = getState().team.owner;
    const teamId = getState().team._id;
    if(owner === userId){
        const response = await backend.patch("/team/image", {
                teamId,
                imageUrl
        });
        dispatch({type:"SAVE_TEAM_IMAGE", payload: response.data});
    }
    else{
        console.error("owner !== userId");
    }
}

export const watchTeam = () => async (dispatch, getState) => {
    const userId = getState().user._id;
    const teamId = getState().team._id;
    if(userId && teamId){
        const response = await backend.patch("/watch", {userId,teamId});
        dispatch({type: "WATCH_TEAM", payload: response.data});
    }
}

export const watchTeamAndFetchUser = () => async (dispatch) => {
   await dispatch(watchTeam());
   dispatch(fetchUser());
}

export const unwatchTeam = () => async (dispatch, getState) => {
    const userId = getState().user._id;
    const teamId = getState().team._id;
    if(userId && teamId){
        const response = await backend.patch("/unwatch", {userId,teamId});
        dispatch({type: "UNWATCH_TEAM", payload: response.data});
    }
}

export const unwatchTeamAndFetchUser = () => async (dispatch) => {
    await dispatch(unwatchTeam());
    dispatch(fetchUser());
 }

export const sendJoinTeamRequest = () => async (dispatch, getState) => {
    const teamId = getState().team._id;
    const userId = getState().user._id;
    backend.patch("/notifications", {
        notificationType: "Join Team Request",
        teamId,
        userId
    });
} 

//League Action Creators
export const createLeague = formValues => async (dispatch, getState) => {
    const owner = getState().user._id;
    const response = await backend.post("/api/league", {...formValues, owner: owner});

    dispatch({type: "CREATE_LEAGUE", payload: response.data});
    dispatch(toggleCreateLeagueModal());
}

export const createLeagueAndFetchUser = (formValues) => async (dispatch) => {
    await dispatch(createLeague(formValues));
    dispatch(fetchUser());
}

export const fetchLeague = (leagueId) => async dispatch => {
    const response = await backend.get("/league", {
        params: {
            leagueId: leagueId
        }
    });
    
    dispatch({type: "FETCH_LEAGUE", payload: response.data})
}

//Posts Action Creators
export const createPost = () => async (dispatch, getState) => {
    const author = getState().user.username;
    const postText = getState().post.postText;
    const gifId = getState().post.gif.id;
    const outlook = getState().post.outlook;
    const dataToSend = {author, postText, gifId, outlook, dateTime: Date.now(), likes: {}, retwits: {}, comments: {}}
    const response = await backend.post("/api/posts", dataToSend);

    dispatch({type: "CREATE_POST", payload: response.data})
    dispatch(emptyPostData());
}

export const fetchTeamPosts = (teamAbbrev) => async dispatch => {
    const response = await backend.get("/api/posts/team", {
        params: {
            teamAbbrev: teamAbbrev
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

export const fetchUserAndWatchListPosts = () => async (dispatch) => {
    await dispatch(fetchUser());
    dispatch(fetchWatchListPosts());
}



export const likePost = (postId) => async (dispatch, getState) => {
    const username = getState().user.username;
    const userId = getState().user._id;
    const response = await backend.patch("/posts/like", {
        postId,
        username,
        userId 
    });

    dispatch({type: "LIKE_POST", payload: {postId, likes:response.data}})
}

export const unlikePost = (postId) => async (dispatch) => {
    const response = await backend.patch("/posts/unlike", {
        params: {
            postId
        }
    });

    dispatch({type: "UNLIKE_POST", payload: response.data})
}

export const createCommentOnPost = () => async (dispatch, getState) => {
    console.log("creatingComment");
    const parentPostId = getState().trackedPost._id;
    const author = getState().user.username;
    const postText = getState().post.postText;
    const gifId = getState().post.gif.id;
    const outlook = getState().post.outlook;
    const dataToSend = {
        parentPostId,
        author,
        postText, 
        gifId, 
        outlook, 
        dateTime: Date.now(), 
        likes: {}, 
        retwits: {}, 
        comments: {}
    }
    const response = await backend.patch("/posts/comment", dataToSend);

    dispatch({type: "CREATE_COMMENT_ON POST", payload: {parentPostId, comments:response.data}})
    dispatch(emptyPostData());
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











