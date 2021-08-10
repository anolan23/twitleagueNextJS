import React, { useState, useEffect } from "react";
import Link from "next/link";

import suggestedTeams from "../sass/components/SuggestedTeams.module.scss";
import TwitCard from "./TwitCard";
import backend from "../lib/backend";
import Trend from "./Trend";

function WhatsHappening() {
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    fetchTrends();
  }, []);

  if (!trends) {
    return null;
  } else if (trends.length === 0) {
    return null;
  }

  async function fetchTrends() {
    const trends = await backend.get("/api/trends");
    setTrends(trends.data);
  }

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
  };

  return (
    <TwitCard title="What's happening" footer={renderFooter()}>
      {renderItems()}
    </TwitCard>
  );
}

export default WhatsHappening;
