import Popup from "./Popup";
import TwitItem from "../TwitItem";
import Empty from "../Empty";

function RosterPopup({ roster, show, onHide, title }) {
  const renderBody = () => {
    if (!roster) {
      return (
        <Empty main="No players" sub="There aren't any players on this team" />
      );
    } else {
      return roster.map((user, index) => {
        return (
          <TwitItem
            key={index}
            avatar={user.avatar}
            title={user.name}
            subtitle={`@${user.username}`}
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

export default RosterPopup;
