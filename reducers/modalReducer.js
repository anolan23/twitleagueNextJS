const INITIAL_STATE = {
    showSignUpModal: false,
    showLoginModal: false,
    showCreateTeamModal:false,
    showCreateLeagueModal: false,
    showGifModal: false,
    showPostModal: false,
    showAddEventModal: false,
    showAvatarModal: false,
    showScheduleModal: false,
    showRosterModal: false
}

const modalReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case "TOGGLE_SIGNUP_MODAL":
            return {...state, showSignUpModal: !state.showSignUpModal}
        case "TOGGLE_LOGIN_MODAL":
            return {...state, showLoginModal: !state.showLoginModal}
        case "TOGGLE_CREATE_TEAM_MODAL":
            return {...state, showCreateTeamModal: !state.showCreateTeamModal}  
        case "TOGGLE_CREATE_LEAGUE_MODAL":
            return {...state, showCreateLeagueModal: !state.showCreateLeagueModal}    
        case "TOGGLE_GIF_MODAL":
            return {...state, showGifModal: !state.showGifModal}  
        case "TOGGLE_POST_MODAL":
            return {...state, showPostModal: !state.showPostModal} 
        case "TOGGLE_ADDEVENT_MODAL":
            return {...state, showAddEventModal: !state.showAddEventModal}
        case "TOGGLE_AVATAR_MODAL":
            return {...state, showAvatarModal: !state.showAvatarModal}   
        case "TOGGLE_SCHEDULE_MODAL":
            return {...state, showScheduleModal: !state.showScheduleModal} 
        case "TOGGLE_ROSTER_MODAL":
            return {...state, showRosterModal: !state.showRosterModal} 
        default:
            return state;
    }
}

export default modalReducer;