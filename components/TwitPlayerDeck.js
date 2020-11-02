import React from "react";

import TwitPlayerCard from "./TwitPlayerCard";

function TwitPlayerDeck(){

    return (
        <div className="twit-card-deck">
            <TwitPlayerCard/>
            <TwitPlayerCard/>
            <TwitPlayerCard/>
            <TwitPlayerCard/>
            <TwitPlayerCard/>
        </div>
    );
}
export default TwitPlayerDeck;