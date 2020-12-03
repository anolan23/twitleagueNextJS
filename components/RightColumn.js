import React from "react";

import TwitCard from "./TwitCard";
import TwitCardItem from "./TwitCardItem";
import AutoCompleteForm from "./modals/AutoCompleteForm";

function RightColumn(){
    return (
        <div className="right-bar__right-column">
            <div className="right-bar__right-column__input-box">
                <svg className="right-bar__right-column__icon">
                    <use xlinkHref="/sprites.svg#icon-search"/>
                </svg>
                <AutoCompleteForm inline placeHolder="Search twitleague"/>
            </div>
            <TwitCard title="Who to Scout" footer="Show more">
                <TwitCardItem mainText="Investar Bank" subText="@realinvestar"/>
                <TwitCardItem mainText="Darkie" subText="@Darkie_..."/>
                <TwitCardItem mainText="chad mazanowski" subText="@ChadMazanowski"/>
            </TwitCard>
        </div>
    )
}

export default RightColumn;