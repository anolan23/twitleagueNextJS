import React, { useState } from "react";
import { useFormik } from "formik";

import { search, sendNotification } from "../../actions";
import scoutPopupStyle from "../../sass/components/ScoutPopup.module.scss";
import Popup from "./Popup";
import TwitItem from "../TwitItem";
import TwitInput from "../TwitInput";
import Empty from "../Empty";
import TwitButton from "../TwitButton";

function ScoutPopup({ team, show, onHide, userId }) {
  const [users, setUsers] = useState(null);

  const formik = useFormik({
    initialValues: {
      search: "",
    },
  });

  const onChange = async (event) => {
    formik.handleChange(event);
    const users = await search({
      query: event.target.value,
      filter: "users",
      userId,
      startIndex: 0,
      stopIndex: 10,
    });

    setUsers(users);
  };

  async function onInviteClick(user) {
    const notification = {
      type: "Join Team Invite",
      user_id: user.id,
      sender_id: null,
      team_id: team.id,
      league_id: null,
      event_id: null,
    };
    const sentNotification = await sendNotification(notification);
  }

  const renderBody = () => {
    return (
      <div className={scoutPopupStyle["scout-popup__content"]}>
        {renderContent()}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={scoutPopupStyle["scout-popup__content__invite"]}>
        <div
          className={
            scoutPopupStyle["scout-popup__content__invite__input-holder"]
          }
        >
          <TwitInput
            type="text"
            placeHolder="Invite players"
            name="search"
            onChange={onChange}
            value={formik.values.search}
          />
        </div>
        {renderUsers()}
      </div>
    );
  };

  const renderUsers = () => {
    if (!users) {
      return (
        <Empty
          main="Invite players"
          sub={`Search above for players to add to the team`}
          actionText="Search"
        />
      );
    } else {
      return users.map((user, index) => {
        return (
          <TwitItem
            key={index}
            avatar={user.avatar}
            title={user.name}
            subtitle={`@${user.username}`}
            actionText="Invite"
          >
            <TwitButton color="primary" onClick={() => onInviteClick(user)}>
              Invite
            </TwitButton>
          </TwitItem>
        );
      });
    }
  };

  return <Popup show={show} body={renderBody()} onHide={onHide} />;
}

export default ScoutPopup;
