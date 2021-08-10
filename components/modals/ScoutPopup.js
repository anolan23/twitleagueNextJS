import React, { useState } from "react";
import { useFormik } from "formik";

import { sendNotification } from "../../actions";
import backend from "../../lib/backend";
import scoutPopupStyle from "../../sass/components/ScoutPopup.module.scss";
import Popup from "./Popup";
import TwitItem from "../TwitItem";
import Input from "../Input";
import Empty from "../Empty";
import TwitButton from "../TwitButton";

function ScoutPopup({ team, show, onHide }) {
  const [users, setUsers] = useState(null);

  const formik = useFormik({
    initialValues: {
      search: "",
    },
  });

  const onChange = async (event) => {
    formik.handleChange(event);
    const users = await backend.get("api/users/search", {
      params: {
        query: event.target.value,
      },
    });
    setUsers(users.data);
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
          <Input type="text" placeHolder="Search players" onChange={onChange} />
        </div>
        {renderUsers()}
      </div>
    );
  };

  const renderUsers = () => {
    if (!users) {
      return (
        <Empty
          main="Search"
          sub="search above for players to add to your roster"
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
