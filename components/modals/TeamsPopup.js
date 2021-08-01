import { useRouter } from "next/router";

import Popup from "./Popup";
import TwitItem from "../TwitItem";
import Empty from "../Empty";

function TeamsPopup({ teams, show, onHide, title }) {
  const router = useRouter();
  const renderBody = () => {
    if (!teams) {
      return (
        <Empty main="No teams" sub="There aren't any teams in this league" />
      );
    } else {
      return teams.map((team, index) => {
        return (
          <TwitItem
            key={index}
            avatar={team.avatar}
            title={team.team_name}
            subtitle={team.abbrev}
            onClick={() => router.push(`/teams/${team.abbrev.substring(1)}`)}
          />
        );
      });
    }
  };

  return (
    <Popup
      show={show}
      heading={null}
      body={renderBody()}
      onHide={onHide}
      title={title}
    />
  );
}

export default TeamsPopup;
