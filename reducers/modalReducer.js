const INITIAL_STATE = {
    showSignUpModal: false,
    showLoginModal: false,
    showCreateTeamModal:false,
    showCreateLeagueModal: false,
    showGifPopup: false,
    showPostModal: false,
    showEditProfilePopup: false,
    showScheduleModal: false,
    showRosterModal: false,
    showPopupCompose: false,
    showPopupReply: false,
    showSignupPopup: false,
    showEditTeamPopup: false,
    showEditRosterPopup: false,
    showPanel: false,
    showEditEventsPopup: false,
    showUpdateScorePopup: false
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
        case "TOGGLE_GIF_POPUP":
            return {...state, showGifPopup: !state.showGifPopup}  
        case "TOGGLE_POST_MODAL":
            return {...state, showPostModal: !state.showPostModal} 
        case "TOGGLE_EDIT_PROFILE_MODAL":
            return {...state, showEditProfilePopup: !state.showEditProfilePopup} 
        case "TOGGLE_EDIT_TEAM_MODAL":
            return {...state, showEditTeamPopup: !state.showEditTeamPopup}      
        case "TOGGLE_SCHEDULE_MODAL":
            return {...state, showScheduleModal: !state.showScheduleModal} 
        case "TOGGLE_ROSTER_MODAL":
            return {...state, showRosterModal: !state.showRosterModal} 
        case "TOGGLE_POPUP_COMPOSE":
            return {...state, showPopupCompose: !state.showPopupCompose} 
        case "TOGGLE_POPUP_REPLY":
            return {...state, showPopupReply: !state.showPopupReply}
        case "TOGGLE_SIGNUP_POPUP":
            return {...state, showSignupPopup: !state.showSignupPopup}
        case "TOGGLE_EDIT_ROSTER_POPUP":
            return {...state, showEditRosterPopup: !state.showEditRosterPopup}
        case "TOGGLE_PANEL":
            return {...state, showPanel: !state.showPanel}
        case "TOGGLE_EDIT_EVENTS_POPUP":
            return {...state, showEditEventsPopup: !state.showEditEventsPopup}
        case "TOGGLE_UPDATE_SCORE_POPUP":
            return {...state, showUpdateScorePopup: !state.showUpdateScorePopup}
        default:
            return state;
    }
}

export default modalReducer;