import React, { useEffect, useState } from "react";

import scoresCard from "../sass/components/ScoresCard.module.scss";
import { fetchScores } from "../actions";
import Score from "./Score";
import TwitCard from "./TwitCard";
import TwitSpinner from "./TwitSpinner";
import Empty from "./Empty";

function ScoresCard({ seasonId }) {
  const [scores, setScores] = useState(null);

  useEffect(async () => {
    const scores = await fetchScores(seasonId);
    setScores(scores);
  }, [seasonId]);

  if (!scores) {
    return null;
  } else if (scores.length === 0) {
    return null;
  }

  const renderFooter = () => {
    return (
      <div className={scoresCard["scores-card__footer"]} onClick={null}>
        <span className={scoresCard["scores-card__footer__text"]}>
          View scores
        </span>
      </div>
    );
  };

  const renderBody = () => {
    return scores.map((score, index) => {
      return <Score key={index} event={score} />;
    });
  };

  return (
    <TwitCard title={"Scores"} footer={renderFooter()}>
      {renderBody()}
    </TwitCard>
  );
}

export default ScoresCard;
