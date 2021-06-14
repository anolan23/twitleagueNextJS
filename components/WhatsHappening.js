import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Link from "next/link";

import suggestedTeams from "../sass/components/SuggestedTeams.module.scss";
import TwitCard from "./TwitCard";
import backend from "../lib/backend";
import { follow, unFollow } from "../actions";
import Empty from "./Empty";
import Trend from "./Trend";
import TwitSpinner from "./TwitSpinner";

function WhatsHappening(props) {
  const [items, setItems] = useState(null);
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    const trends = await backend.get("/api/trends");
    setTrends(trends.data);
  };

  const renderFooter = () => {
    return (
      <Link href="/suggested">
        <div className={suggestedTeams["suggested-teams__footer"]}>
          <span className={suggestedTeams["suggested-teams__footer__text"]}>
            Show more
          </span>
        </div>
      </Link>
    );
  };

  const renderItems = () => {
    if (!trends) {
      return <TwitSpinner />;
    } else if (trends.length === 0) {
      return <Empty main="Nothing here" sub="Try again later" />;
    } else {
      return trends.map((trend, index) => {
        return (
          <Trend
            key={index}
            topic="Teams"
            trend={trend.abbrev}
            count={trend.count}
          />
        );
      });
    }
  };

  return (
    <TwitCard title="What's happening" footer={renderFooter()}>
      {renderItems()}
    </TwitCard>
  );
}

const mapStateToProps = (state) => {
  return { userId: state.user.id };
};

export default connect(mapStateToProps)(WhatsHappening);
