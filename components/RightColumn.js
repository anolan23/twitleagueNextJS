import React from "react";

import SuggestedTeams from "./SuggestedTeams";
import TwitSearch from "./modals/TwitSearch";

function RightColumn(){
    return (
        <div className="right-bar__right-column">
            <div className="right-bar__right-column__input-box">
                <svg className="right-bar__right-column__icon">
                    <use xlinkHref="/sprites.svg#icon-search"/>
                </svg>
                <TwitSearch inline placeHolder="Search twitleague"/>
            </div>
            <SuggestedTeams/>
        </div>
    )
}

export default RightColumn;