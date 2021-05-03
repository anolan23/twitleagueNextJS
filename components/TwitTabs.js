import React from "react"

import twitTabs from "../sass/components/TwitTabs.module.scss";

function TwitTabs({children}){
    return(
        <nav className={twitTabs["twit-tabs"]}>
            {children}
        </nav>
    )
}

export default TwitTabs;