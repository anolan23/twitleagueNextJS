import React, { useState } from "react";
import { useFormik } from "formik";

import { search, sendNotification } from "../../actions";
import style from "../../sass/components/JoinLeaguePopup.module.scss";
import Popup from "./Popup";
import TwitItem from "../TwitItem";
import TwitInput from "../TwitInput";
import Empty from "../Empty";
import TwitButton from "../TwitButton";

function JoinLeaguePopup({ team, show, onHide, userId }) {
  const [leagues, setLeagues] = useState(null);

  const formik = useFormik({
    initialValues: {
      search: "",
    },
  });

  const onChange = async (event) => {
    formik.handleChange(event);
    const leagues = await search({
      query: event.target.value,
      filter: "leagues",
      userId,
      startIndex: 0,
      stopIndex: 10,
    });

    setLeagues(leagues);
  };

  async function onJoinClick(league) {
    const notification = {
      type: "Join League Request",
      user_id: league.owner_id,
      sender_id: null,
      team_id: team.id,
      league_id: league.id,
      event_id: null,
    };
    const sentNotification = await sendNotification(notification);
  }

  const renderBody = () => {
    return (
      <div className={style["join-league-popup__content"]}>
        {renderContent()}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={style["join-league-popup__content__invite"]}>
        <div
          className={style["join-league-popup__content__invite__input-holder"]}
        >
          <TwitInput
            type="text"
            placeHolder="Join a league"
            name="search"
            onChange={onChange}
            value={formik.values.search}
          />
        </div>
        {renderLeagues()}
      </div>
    );
  };

  const renderLeagues = () => {
    if (!leagues) {
      return (
        <Empty main="Join a league" sub="Search above for leagues to join" />
      );
    } else {
      return leagues.map((league, index) => {
        return (
          <TwitItem
            key={index}
            avatar={league.avatar}
            title={league.league_name}
            subtitle={league.sport}
          >
            <TwitButton color="primary" onClick={() => onJoinClick(league)}>
              Request join
            </TwitButton>
          </TwitItem>
        );
      });
    }
  };

  return <Popup show={show} body={renderBody()} onHide={onHide} />;
}

export default JoinLeaguePopup;
