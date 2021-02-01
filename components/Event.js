import React from "react";
import {connect} from "react-redux";

import event from "../sass/components/Event.module.scss";
import Avatar from "./Avatar";

function Event() {

    return(
            <div className={event["event"]}>
                <div className={event["event__date"]}>
                    <span className={event["event__date--day"]}>12</span>
                    <span className={event["event__date--month"]}>Jan</span>
                </div>
                <div className={event["event__matchup"]}>
                    <div className={event["event__matchup__team"]}>
                        <Avatar className={event["event__matchup__team__avatar"]}/>
                        <span className={event["event__matchup__team__team-name"]}>Pythons</span>
                    </div>
                    <div className={event["event__info"]}>
                        <span className={event["event__type"]}>Game</span>
                        <span className={event["event__matchup__vs"]}>vs</span>
                        <span className={event["event__time"]}>7:30PM</span>
                        <span className={event["event__location"]}>McCollumn Park</span>
                    </div>
                    <div className={event["event__matchup__team"]}>
                        <Avatar className={event["event__matchup__team__avatar"]}/>
                        <span className={event["event__matchup__team__team-name"]}>Barons</span>
                    </div>
                </div>
              

                
            </div>
    );
}

const mapStateToProps = (state) => {
    return {team: state.team}
}

export default connect(mapStateToProps)(Event);