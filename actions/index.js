import backend from "../lib/backend";

//User Action Creators
export const createUser = (formValues) => async (dispatch) => {
  const response = await backend.post("/api/signup", formValues);

  dispatch({ type: "CREATE_USER", payload: response.data });
  dispatch(toggleSignUpModal());
};

export const fetchUser = () => async (dispatch) => {
  const response = await backend.get("/api/users");
  dispatch({ type: "FETCH_USER", payload: response.data });
};

export const fetchUserByUsername = async (username, userId) => {
  const user = await backend.get(`/api/users/${username}`, {
    params: {
      userId,
    },
  });
  return user.data;
};

export const loginUser = async (values) => {
  const response = await backend.post("/api/login", values);
  return response.data;
};

export const logOutUser = async () => {
  const response = await backend.get("/api/logout");
  return response.data;
};

export const deleteNotification =
  (notificationId) => async (dispatch, getState) => {
    let notifications = getState().user.notifications;
    notifications = notifications.filter((notification) => {
      return notification.id !== notificationId;
    });
    dispatch({ type: "DELETE_NOTIFICATION", payload: notifications });
    backend.delete("/api/notifications", {
      params: {
        notificationId,
      },
    });
  };

export const updateUserProfile = (values) => async (dispatch, getState) => {
  const userId = getState().user.id;
  if (!userId) {
    return;
  }
  const response = await backend.patch("/api/users", {
    userId,
    values,
  });

  dispatch({ type: "UPDATE_USER_PROFILE", payload: response.data });
};

//Modal Action Creators
export const toggleSignUpModal = () => {
  return { type: "TOGGLE_SIGNUP_MODAL" };
};

export const toggleLoginModal = () => {
  return { type: "TOGGLE_LOGIN_MODAL" };
};

export const toggleCreateTeamModal = () => {
  return { type: "TOGGLE_CREATE_TEAM_MODAL" };
};

export const toggleCreateLeagueModal = () => {
  return { type: "TOGGLE_CREATE_LEAGUE_MODAL" };
};

export const toggleGifPopup = () => {
  return { type: "TOGGLE_GIF_POPUP" };
};

export const togglePostModal = () => {
  return { type: "TOGGLE_POST_MODAL" };
};

export const toggleScheduleModal = () => {
  return { type: "TOGGLE_SCHEDULE_MODAL" };
};

export const toggleRosterModal = () => {
  return { type: "TOGGLE_ROSTER_MODAL" };
};

export const togglePopupReply = () => {
  return { type: "TOGGLE_POPUP_REPLY" };
};

export const togglePopupEventReply = () => {
  return { type: "TOGGLE_POPUP_EVENT_REPLY" };
};

export const toggleSignupPopup = () => {
  return { type: "TOGGLE_SIGNUP_POPUP" };
};

export const toggleEditProfilePopup = () => (dispatch, getState) => {
  dispatch({ type: "TOGGLE_EDIT_PROFILE_MODAL" });
};

export const toggleEditTeamPopup = () => (dispatch) => {
  dispatch({ type: "TOGGLE_EDIT_TEAM_MODAL" });
};

export const toggleEditRosterPopup = () => (dispatch) => {
  dispatch({ type: "TOGGLE_EDIT_ROSTER_POPUP" });
};

export const toggleEditEventsPopup = () => (dispatch) => {
  dispatch({ type: "TOGGLE_EDIT_EVENTS_POPUP" });
};

export const toggleEditDivisionsPopup = () => (dispatch) => {
  dispatch({ type: "TOGGLE_EDIT_DIVISIONS_POPUP" });
};

export const toggleUpdateScorePopup = () => (dispatch) => {
  dispatch({ type: "TOGGLE_UPDATE_SCORE_POPUP" });
};

export const togglePanel = () => {
  return { type: "TOGGLE_PANEL" };
};

//Team Action Creators

export const setTeam = (team) => (dispatch) => {
  dispatch({ type: "SET_TEAM", payload: team });
};

export const createTeam = async (userId, team) => {
  const response = await backend.post("api/teams", {
    userId,
    team,
  });
  return response.data;
};

export const createTeamAndFetchUser = (formValues) => async (dispatch) => {
  await dispatch(createTeam(formValues));
  dispatch(fetchUser());
};

export const fetchTeam = async (abbrev, userId) => {
  const team = await backend.get(`/api/teams/${abbrev}`, {
    params: {
      userId,
    },
  });

  return team.data;
};

export const fetchTeamsByLeagueName = async (leagueName) => {
  const team = await backend.get(`/api/leagues/${leagueName}/teams`);

  return team.data;
};

export const findTeamsByUsername = async (username) => {
  if (!username) {
    return;
  }
  const teams = await backend.get(`/api/users/${username}/teams`);

  return teams.data;
};

export const fetchTeamAndTeamPosts = (teamAbbrev) => async (dispatch) => {
  await dispatch(fetchTeam(teamAbbrev));
  dispatch(fetchTeamPosts(teamAbbrev));
};

export const findEventsByTeamId = async (teamId) => {
  const response = await backend.get(`/api/teams/${teamId}/events`);
  return response.data;
};

export const findEventsByTeamAbbrev = async (abbrev) => {
  const response = await backend.get(`/api/teams/${abbrev}/events`);
  return response.data;
};

export const findSeasonsByLeagueName = async (leagueName) => {
  const seasons = await backend.get(`/api/leagues/${leagueName}/seasons`);
  return seasons.data;
};

export const updatePlayoffs = async (seasonId, columns) => {
  const response = await backend.patch(
    `/api/playoffs`,
    {
      columns,
    },
    {
      params: {
        seasonId,
      },
    }
  );
  return response.data;
};

export const addTeamEventAndFetchTeam =
  (values) => async (dispatch, getState) => {
    const teamAbbrev = getState().team.teamAbbrev.substring(1);
    await dispatch(addTeamEvent(values));
    dispatch(fetchTeam(teamAbbrev));
  };

export const saveTeamImages =
  (teamImageUrl, bannerImageUrl) => async (dispatch, getState) => {
    const state = getState();
    const userId = state.user._id;
    const owner = state.team.owner;
    const teamAbbrev = getState().team.teamAbbrev.substring(1);
    if (owner === userId) {
      const response = await backend.patch(`api/teams/${teamAbbrev}`, {
        teamImageUrl,
        bannerImageUrl,
      });
      dispatch({ type: "SAVE_TEAM_IMAGES", payload: response.data });
    } else {
      console.error("owner !== userId");
    }
  };

export const follow = async (teamId, userId) => {
  const response = await backend.post("/api/followers", { teamId, userId });
  return response.data;
};

export const unFollow = async (teamId, userId) => {
  const response = await backend.delete("/api/followers", {
    params: {
      userId,
      teamId,
    },
  });
  return response.data;
};

export const scout = async (scouted_user_id, scout_user_id) => {
  const response = await backend.post("/api/scouts", {
    scouted_user_id,
    scout_user_id,
  });
  return response.data;
};

export const unScout = async (scouted_user_id, scout_user_id) => {
  const response = await backend.delete("/api/scouts", {
    params: {
      scouted_user_id,
      scout_user_id,
    },
  });
  return response.data;
};

export const watchTeamAndFetchUser = () => async (dispatch) => {
  await dispatch(followTeam());
  dispatch(fetchUser());
};

export const unwatchTeam = () => async (dispatch, getState) => {
  const state = getState();
  const userId = state.user._id;
  const teamId = state.team._id;
  if (userId && teamId) {
    const response = await backend.patch("/unwatch", { userId, teamId });
    dispatch({ type: "UNFOLLOW_TEAM", payload: response.data });
  }
};

export const unwatchTeamAndFetchUser = () => async (dispatch) => {
  await dispatch(unwatchTeam());
  dispatch(fetchUser());
};

export const sendJoinTeamInvite = (userId, teamId) => async () => {
  backend.post("/api/notifications", {
    userId,
    type: "Join Team Invite",
    payload: {
      teamId,
    },
  });
};

export const sendNotification = async ({ userId, type, payload }) => {
  const notification = await backend.post("/api/notifications", {
    userId,
    type,
    payload,
  });
  return notification.data;
};

export const updateLeagueByName = async (leagueName, columns) => {
  const league = await backend.patch(`/api/leagues/${leagueName}`, {
    columns,
  });
  return league.data;
};

export const updateTeamById = async (teamId, columns) => {
  const team = await backend.patch("/api/teams", { teamId, columns });
  return team.data;
};

export const updateTeamByAbbrev = async (abbrev, columns) => {
  //no route created yet...
  const team = await backend.patch(`/api/teams/${abbrev.substring(1)}`, {
    columns,
  });
  return team.data;
};

export const createLeague = (values) => async (dispatch, getState) => {
  const ownerId = getState().user.id;
  backend.post("/api/leagues", { ...values, ownerId });
};

export const createLeagueAndFetchUser = (formValues) => async (dispatch) => {
  await dispatch(createLeague(formValues));
  dispatch(fetchUser());
};

export const fetchLeague = async (leagueName) => {
  const league = await backend.get(`/api/leagues/${leagueName}`);
  return league.data;
};

export const fetchLeagues = async (userId) => {
  const leagues = await backend.get("/api/leagues", {
    params: {
      ownerId: userId,
    },
  });
  return leagues.data;
};

export const setLeague = (league) => (dispatch) => {
  dispatch({ type: "SET_LEAGUE", payload: league });
};

export const createPost = async (post, userId) => {
  const response = await backend.post("/api/posts", { ...post, userId });
  return response.data;
};

export const deletePost = async (postId) => {
  const post = await backend.delete(`/api/posts/${postId}`);
  return post.data;
};

export const createReply = async (reply, userId) => {
  const { conversation_id } = reply;
  const response = await backend.post(
    `/api/thread/${conversation_id}/replies`,
    {
      reply: { ...reply, userId },
    }
  );
  return response.data;
};

export const fetchThreadReplies = async (threadId, userId) => {
  const response = await backend.get(`/api/thread/${threadId}/replies`, {
    params: {
      userId,
    },
  });
  return response.data;
};

export const sendEventReply = (reply) => async (dispatch, getState) => {
  const state = getState();
  const userId = state.user.id;
  const response = await backend.post(`/api/events/posts`, {
    reply: { ...reply, userId },
  });
  dispatch({ type: "SEND_EVENT_POST", payload: response.data });
  dispatch(togglePopupEventReply());
};

export const fetchEventPosts = async (eventId, userId) => {
  const posts = await backend.get(`/api/events/${eventId}/posts`, {
    params: {
      userId,
    },
  });
  return posts.data;
};

export const fetchTeamPosts = (teamId) => async (dispatch, getState) => {
  const userId = getState().user.id;
  const response = await backend.get("/api/posts/team", {
    params: {
      userId,
      teamId,
    },
  });

  dispatch({ type: "FETCH_TEAM_POSTS", payload: response.data });
};

export const getTeamPosts = async ({
  userId,
  teamId,
  startIndex,
  stopIndex,
}) => {
  const posts = await backend.get("/api/posts/team", {
    params: {
      userId,
      teamId,
      startIndex,
      stopIndex,
    },
  });

  return posts.data;
};

export const fetchWatchListPosts = () => async (dispatch, getState) => {
  const watchList = getState().user.watchList;
  if (watchList) {
    const response = await backend.get("api/posts/watchlist", {
      params: {
        watchList,
      },
    });

    dispatch({ type: "FETCH_WATCHLIST_POSTS", payload: response.data });
  }
};

export const fetchHomeTimeline = async (userId, startIndex, stopIndex) => {
  const homeTimeLine = await backend.get("/api/posts/home", {
    params: {
      userId,
      startIndex,
      stopIndex,
    },
  });
  return homeTimeLine.data;
};

export const fetchPostsByUsername = async ({
  username,
  userId,
  startIndex,
  stopIndex,
}) => {
  const posts = await backend.get(`/api/users/${username}/posts`, {
    params: {
      userId,
      startIndex,
      stopIndex,
    },
  });

  return posts.data;
};

export const fetchMediaPostsByUsername = async ({
  username,
  userId,
  startIndex,
  stopIndex,
}) => {
  const posts = await backend.get(`/api/users/${username}/posts/media`, {
    params: {
      userId,
      startIndex,
      stopIndex,
    },
  });

  return posts.data;
};

export const fetchLikedPostsByUsername = async ({
  username,
  userId,
  startIndex,
  stopIndex,
}) => {
  const posts = await backend.get(`/api/users/${username}/posts/likes`, {
    params: {
      userId,
      startIndex,
      stopIndex,
    },
  });

  return posts.data;
};

export const fetchLeaguePosts = (leagueId) => async (dispatch) => {
  const response = await backend.get("/api/posts/league", {
    params: {
      leagueId: leagueId,
    },
  });

  dispatch({ type: "FETCH_LEAGUE_POSTS", payload: response.data });
};

export const fetchSearchedPosts = async (query, userId, num, offset) => {
  const posts = await backend.get("/api/posts", {
    params: {
      query,
      userId,
      num,
      offset,
    },
  });

  return posts.data;
};

export const fetchThreadPosts = (postId) => async (dispatch, getState) => {
  const userId = getState().user.id;
  const response = await backend.get("/api/posts/thread", {
    params: {
      userId,
      postId,
    },
  });

  dispatch({ type: "FETCH_THREAD_POSTS", payload: response.data });
};

export const fetchUserAndWatchListPosts = () => async (dispatch) => {
  await dispatch(fetchUser());
  dispatch(fetchWatchListPosts());
};

export const likePost = async (postId, userId) => {
  const response = await backend.post(`/api/posts/${postId}/likes`, {
    userId,
  });
  return response.data;
};

export const unLikePost = async (postId, userId) => {
  const response = await backend.delete(`/api/posts/${postId}/likes`, {
    params: {
      userId,
    },
  });
  return response.data;
};

export const likeEvent = async (eventId, userId) => {
  const response = await backend.post(`/api/events/${eventId}/likes`, {
    userId,
  });
  return response.data;
};

export const unLikeEvent = async (eventId, userId) => {
  const response = await backend.delete(`/api/events/${eventId}/likes`, {
    params: {
      userId,
    },
  });
  return response.data;
};

export const clearPosts = () => async (dispatch) => {
  dispatch({ type: "CLEAR_POSTS", payload: null });
};

export const clearReplies = () => async (dispatch) => {
  dispatch({ type: "CLEAR_REPLIES", payload: null });
};

//Post Action Creators
export const saveCurrentPostText = (body) => {
  return { type: "SAVE_CURRENT_BODY", payload: body };
};

export const setMedia = (media) => async (dispatch) => {
  dispatch({ type: "SET_MEDIA", payload: media });
};

export const closeMedia = () => {
  return { type: "CLOSE_MEDIA" };
};

export const saveCurrentOutlook = (outlook) => {
  return { type: "SAVE_CURRENT_OUTLOOK", payload: outlook };
};

export const emptyPostData = () => {
  return { type: "EMPTY_POST_DATA" };
};

//Tracked Post Action Creators
export const trackClickedPost = (post) => {
  return { type: "TRACK_CLICKED_POST", payload: post };
};

//Notifications Action Creators
export const fetchNotifications = async (userId) => {
  const response = await backend.get("/api/notifications", {
    params: {
      userId,
    },
  });
  return response.data;
};

export const sendAwaitingEventApprovalNotification = async (
  userId,
  eventId
) => {
  const notification = await backend.post("/api/notifications", {
    userId,
    type: "Awaiting Event Approval",
    payload: {
      eventId,
    },
  });
  return notification.data;
};

export const fetchEvent = async (eventId) => {
  const event = await backend.get(`/api/events/${eventId}`);
  return event.data;
};

export const createEvent = async (event) => {
  const response = await backend.post("/api/events", {
    event,
  });
  return response.data;
};

export const setEvent = (event) => (dispatch) => {
  if (event) {
    dispatch({ type: "SET_EVENT", payload: event });
  }
};

export const updateEvent = async (eventId, columns) => {
  const response = await backend.patch(`/api/events/${eventId}`, {
    columns,
  });
  return response.data;
};

export const approveEvent = async (eventId) => {
  const event = backend.patch(`/api/events/${eventId}`, {
    columns: {
      league_approved: true,
    },
  });

  return event.data;
};

export const createDivision = async (leagueId, seasonId) => {
  const division = await backend.post("/api/leagues/divisions", {
    leagueId,
    seasonId,
  });
  return division.data;
};

export const assignDivision = async (leagueId) => {
  const division = await backend.post("/api/leagues/divisions", {
    leagueId,
  });
  return division.data;
};

export const addPlayerToRoster = async ({ teamId, userId }) => {
  await backend.post("/api/teams/rosters", {
    teamId,
    userId,
  });
};

export const fetchRoster = async (abbrev) => {
  const roster = await backend.get(`/api/teams/${abbrev}/rosters`);
  return roster.data;
};

export const getStandings = async (league_name, seasonId) => {
  const response = await backend.get(`/api/leagues/${league_name}/standings`, {
    params: {
      seasonId,
    },
  });
  return response.data;
};

export const getLeaguePlayoff = async (leagueName, seasonId) => {
  const response = await backend.get(`/api/leagues/${leagueName}/playoffs`, {
    params: {
      seasonId,
    },
  });
  return response.data;
};

export const createPlayoffs = async (seasonId, playoffs) => {
  const response = await backend.post(
    `/api/playoffs`,
    {
      playoffs,
    },
    {
      params: {
        seasonId,
      },
    }
  );
  return response.data;
};

export const deletePlayoffs = async (seasonId) => {
  const response = await backend.delete(`/api/playoffs`, {
    params: {
      seasonId,
    },
  });
  return response.data;
};

export const startSeason = async (leagueId) => {
  const response = await backend.post(
    `/api/seasons/start`,
    {},
    {
      params: {
        leagueId,
      },
    }
  );
  return response.data;
};

export const endSeason = async (leagueId) => {
  const response = await backend.post(
    `/api/seasons/end`,
    {},
    {
      params: {
        leagueId,
      },
    }
  );
  return response.data;
};

export const fetchScores = async (seasonId) => {
  const scores = await backend.get(`/api/scores`, {
    params: {
      seasonId,
    },
  });
  return scores.data;
};
