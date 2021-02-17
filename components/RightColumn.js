import React from "react";

import SuggestedTeams from "./SuggestedTeams";
import TwitSearch from "./modals/TwitSearch";
import TwitIcon from "../components/TwitIcon";

function RightColumn(){
    return (
        <div className="right-bar__right-column">
            <div className="right-bar__right-column__input-box">
                <div className="right-bar__right-column__input-box__input">
                    <TwitIcon className="right-bar__right-column__icon" icon="/sprites.svg#icon-search"/>
                    <TwitSearch inline placeHolder="Search twitleague"/>
                </div>
            </div>
            <SuggestedTeams/>
        </div>
    )
}

export default RightColumn;