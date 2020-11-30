import React, { Children } from "react"

import twitTabs from "../sass/components/TwitTabs.module.scss";

function TwitTabs({children}){
    return(
        <div className={twitTabs["twit-tabs"]}>
            {children}
        </div>
    )
}

export default TwitTabs;