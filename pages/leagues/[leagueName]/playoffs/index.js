import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import useUser from "../../../../lib/useUser";
import usePan from "../../../../lib/usePan";
import { getSeasonString } from "../../../../lib/twit-helpers";
import {
  updatePlayoffs,
  getLeaguePlayoff,
  createPlayoffs,
  deletePlayoffs,
} from "../../../../actions";
import playoffStyle from "../../../../sass/pages/Playoffs.module.scss";
import Bracket from "../../../../components/Bracket";
import NavBar from "../../../../components/NavBar";
import TwitButton from "../../../../components/TwitButton";
import TwitCard from "../../../../components/TwitCard";
import TwitItemSelect from "../../../../components/TwitItemSelect";
import TwitAlert from "../../../../components/TwitAlert";
import TwitSelect from "../../../../components/TwitSelect";
import TwitSpinner from "../../../../components/TwitSpinner";
import TwitIcon from "../../../../components/TwitIcon";

function Playoffs() {
  const empty = [...Array(32)];

  const { user } = useUser();
  const [offset, startPan] = usePan();
  const router = useRouter();
  const [seeds, setSeeds] = useState([]);
  const [bracket, setBracket] = useState(empty);
  const [champion, setChampion] = useState(null);
  const [inProgress, setInProgress] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [league, setLeague] = useState(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (inProgress) {
      return;
    }
    constructBracketFromSeeds();
  }, [seeds]);

  useEffect(async () => {
    if (!router.query) {
      return;
    }
    const { leagueName, seasonId } = router.query;
    const league = await getLeaguePlayoff(leagueName, seasonId);
    if (!league) {
      return;
    }
    setLeague(league);
    const { playoffs } = league;
    if (!playoffs) {
      setSeeds([]);
      setBracket(empty);
      setInProgress(null);
      return;
    }
    let { seeds, bracket, in_progress } = playoffs;
    if (!bracket || !seeds) {
      setSeeds([]);
      setBracket(empty);
      setInProgress(null);
      return;
    }
    const mappedSeeds = seeds.map((team) => {
      return { ...team, title: team.team_name, subtitle: team.abbrev };
    });
    setInProgress(in_progress);
    setSeeds(mappedSeeds);
    setBracket(bracket);
  }, [router.query]);

  function onSeedSelect(option, index) {
    let newSeeds = [...seeds];
    newSeeds[index] = option;
    setSeeds(newSeeds);
  }

  function onAddSeedClick() {
    setSeeds([...seeds, {}]);
  }

  function onDeleteSeedClick() {
    setSeeds(seeds.filter((_, index) => index !== seeds.length - 1));
  }

  function constructGame(topSlot, bottomSlot) {
    return { topSlot, bottomSlot };
  }

  function constructSlot(seedIndex) {
    return { team: seeds[seedIndex], seed: seedIndex };
  }

  function constructBracketFromSeeds() {
    let tempBracket = empty;
    switch (seeds.length) {
      case 0:
        setBracket(tempBracket);
        break;
      case 1:
        tempBracket[0] = constructGame(constructSlot(0), null);
        setBracket(tempBracket);
        break;
      case 2:
        tempBracket[0] = constructGame(constructSlot(0), constructSlot(1));
        setBracket(tempBracket);
        break;
      case 3:
        tempBracket[0] = constructGame(constructSlot(0), null);
        tempBracket[2] = constructGame(constructSlot(2), constructSlot(1));
        setBracket(tempBracket);
        break;
      case 4:
        tempBracket[1] = constructGame(constructSlot(0), constructSlot(3));
        tempBracket[2] = constructGame(constructSlot(2), constructSlot(1));
        setBracket(tempBracket);
        break;
      case 5:
        tempBracket[1] = constructGame(constructSlot(0), null);
        tempBracket[2] = constructGame(constructSlot(2), constructSlot(1));
        tempBracket[4] = constructGame(constructSlot(4), constructSlot(3));
        setBracket(tempBracket);
        break;
      case 6:
        tempBracket[1] = constructGame(constructSlot(0), null);
        tempBracket[2] = constructGame(null, constructSlot(1));
        tempBracket[4] = constructGame(constructSlot(4), constructSlot(3));
        tempBracket[5] = constructGame(constructSlot(2), constructSlot(5));
        setBracket(tempBracket);
        break;
      case 7:
        tempBracket[1] = constructGame(constructSlot(0), null);
        tempBracket[4] = constructGame(constructSlot(4), constructSlot(3));
        tempBracket[5] = constructGame(constructSlot(2), constructSlot(5));
        tempBracket[6] = constructGame(constructSlot(6), constructSlot(1));
        setBracket(tempBracket);
        break;
      case 8:
        tempBracket[3] = constructGame(constructSlot(0), constructSlot(7));
        tempBracket[4] = constructGame(constructSlot(4), constructSlot(3));
        tempBracket[5] = constructGame(constructSlot(2), constructSlot(5));
        tempBracket[6] = constructGame(constructSlot(6), constructSlot(1));
        setBracket(tempBracket);
        break;
      case 9:
        tempBracket[3] = constructGame(constructSlot(0), null);
        tempBracket[4] = constructGame(constructSlot(4), constructSlot(3));
        tempBracket[5] = constructGame(constructSlot(2), constructSlot(5));
        tempBracket[6] = constructGame(constructSlot(6), constructSlot(1));
        tempBracket[8] = constructGame(constructSlot(8), constructSlot(7));
        setBracket(tempBracket);
        break;
      case 10:
        tempBracket[3] = constructGame(constructSlot(0), null);
        tempBracket[4] = constructGame(constructSlot(4), constructSlot(3));
        tempBracket[5] = constructGame(constructSlot(2), constructSlot(5));
        tempBracket[6] = constructGame(null, constructSlot(1));
        tempBracket[8] = constructGame(constructSlot(8), constructSlot(7));
        tempBracket[13] = constructGame(constructSlot(6), constructSlot(9));
        setBracket(tempBracket);
        break;
      case 11:
        break;
      case 12:
        break;
      case 13:
        break;
      case 14:
        break;
      case 15:
        break;
      case 16:
        break;
      case 17:
        break;
      case 18:
        break;
      case 19:
        break;
      case 20:
        break;

      default:
        break;
    }
  }

  async function advanceTeam(sourceGameId, advancingSlot) {
    let tempBracket = [...bracket];

    const moveTo = async (targetGameId, slotPostion) => {
      if (slotPostion === "topSlot") {
        tempBracket[targetGameId] = constructGame(
          advancingSlot,
          tempBracket[targetGameId]
            ? tempBracket[targetGameId].bottomSlot
            : null
        );
        setBracket(tempBracket);
      } else if (slotPostion === "bottomSlot") {
        tempBracket[targetGameId] = constructGame(
          tempBracket[targetGameId] ? tempBracket[targetGameId].topSlot : null,
          advancingSlot
        );
        setBracket(tempBracket);
      } else return null;

      await save(tempBracket, seeds, inProgress);
    };

    switch (sourceGameId) {
      case 0:
        break;
      case 1:
        moveTo(0, "topSlot");
        break;
      case 2:
        moveTo(0, "bottomSlot");
        break;
      case 3:
        moveTo(1, "topSlot");
        break;
      case 4:
        moveTo(1, "bottomSlot");
        break;
      case 5:
        moveTo(2, "topSlot");
        break;
      case 6:
        moveTo(2, "bottomSlot");
        break;
      case 7:
        break;
      case 8:
        break;
      case 9:
        break;
      case 10:
        break;

      default:
        break;
    }
  }

  async function save(bracket, seeds, inProgress) {
    let bracketArray = bracket;
    let seedsArray = seeds;

    if (bracket) {
      bracketArray = JSON.stringify(bracket);
    }
    if (seeds) {
      seedsArray = JSON.stringify(seeds);
    }

    const savedPlayoffs = await updatePlayoffs(router.query.seasonId, {
      in_progress: inProgress,
      bracket: bracketArray,
      seeds: seedsArray,
    });

    setShowAlert(true);
  }

  async function start() {
    let bracketArray = bracket;
    let seedsArray = seeds;

    if (bracket) {
      bracketArray = JSON.stringify(bracket);
    }
    if (seeds) {
      seedsArray = JSON.stringify(seeds);
    }
    const playoffs = {
      bracket: bracketArray,
      seeds: seedsArray,
      in_progress: true,
    };
    await createPlayoffs(router.query.seasonId, playoffs);
    setInProgress(true);
  }

  async function reset() {
    await deletePlayoffs(router.query.seasonId);
    setBracket(empty);
    setSeeds([]);
    setInProgress(false);
  }

  function seasonOptions() {
    if (!league) {
      return [];
    }
    const { seasons } = league;
    if (!seasons) {
      return [];
    }
    const options = seasons.map((season) => {
      return { text: getSeasonString(season, seasons), id: season.id };
    });
    return options;
  }

  const renderFooter = () => {
    return (
      <div className={playoffStyle["playoffs__sidebar__footer"]}>
        <TwitButton
          color="primary"
          onClick={onAddSeedClick}
          expanded
          disabled={inProgress}
        >
          Add
        </TwitButton>
        <TwitButton
          color="primary"
          outline="primary"
          onClick={onDeleteSeedClick}
          expanded
          disabled={inProgress}
        >
          Remove
        </TwitButton>
      </div>
    );
  };

  const renderStatusButton = () => {
    if (!inProgress) {
      return (
        <TwitButton color="primary" onClick={start}>
          Start playoffs
        </TwitButton>
      );
    } else {
      return (
        <TwitButton color="red" onClick={reset}>
          Delete bracket
        </TwitButton>
      );
    }
  };

  const renderSeeds = () => {
    if (!league) {
      return <TwitSpinner size={30} />;
    }
    const getOptions = () => {
      if (!league) {
        return [];
      }
      const { teams } = league;
      if (!teams) {
        return [];
      } else {
        return teams.map((team) => {
          return { ...team, title: team.team_name, subtitle: team.abbrev };
        });
      }
    };
    const options = getOptions();
    return seeds.map((seed, index) => {
      return (
        <TwitItemSelect
          key={index}
          id={index}
          options={options}
          defaultValue={seed}
          onSelect={(option) => onSeedSelect(option, index)}
          disabled={inProgress}
        />
      );
    });
  };

  const renderActions = () => {
    if (!user) {
      return null;
    }
    if (!league) {
      return null;
    }
    if (user.id !== league.owner_id) {
      return null;
    }
    const { seasons } = league;
    if (!seasons) {
      return <div>A season must be started</div>;
    }
    const season = seasons.find((season) => season.id == router.query.seasonId);

    const { end_date } = season;
    if (end_date) {
      return <div>Season completed</div>;
    }

    return (
      <div className={playoffStyle["playoffs__navbar__content__actions"]}>
        {renderStatusButton()}
      </div>
    );
  };

  if (router.isFallback) {
    return null;
  }

  return (
    <React.Fragment>
      <div className={playoffStyle["playoffs"]}>
        <div className={playoffStyle["playoffs__navbar"]}>
          <NavBar title="twitleague">
            <div className={playoffStyle["playoffs__navbar__content"]}>
              <div
                className={playoffStyle["playoffs__navbar__content__league"]}
              >
                <div
                  className={
                    playoffStyle["playoffs__navbar__content__league__name"]
                  }
                >
                  {league ? league.league_name : null}
                </div>
                <TwitSelect
                  options={seasonOptions()}
                  defaultValue={"current season"}
                  onSelect={(id) => {
                    router.push({
                      pathname: `/leagues/${league.league_name}/playoffs`,
                      query: { seasonId: id },
                    });
                  }}
                />
              </div>
              {renderActions()}
            </div>
          </NavBar>
        </div>
        <div className={playoffStyle["playoffs__sidebar"]}>
          <div className={playoffStyle["playoffs__sidebar__content"]}>
            <TwitCard
              title="Playoff teams"
              color="clear"
              footer={renderFooter()}
            >
              <div
                className={
                  playoffStyle["playoffs__sidebar__content__card-body"]
                }
              >
                {renderSeeds()}
              </div>
            </TwitCard>
          </div>
        </div>
        <div
          className={playoffStyle["playoffs__viewport"]}
          onMouseDown={startPan}
        >
          <Bracket
            seeds={seeds}
            bracket={bracket}
            champion={champion}
            advanceTeam={advanceTeam}
            offset={offset}
            scale={scale}
          />
          <div className={playoffStyle["playoffs__viewport__zoom"]}>
            <div
              className={playoffStyle["playoffs__viewport__zoom__button"]}
              onClick={() => setScale(scale - 0.1)}
            >
              <TwitIcon
                className={playoffStyle["playoffs__viewport__zoom__icon"]}
                icon="/sprites.svg#icon-zoom-out"
              />
            </div>
            <div className={playoffStyle["playoffs__viewport__zoom__display"]}>
              {`${Math.round(scale * 100)}%`}
            </div>
            <div
              className={playoffStyle["playoffs__viewport__zoom__button"]}
              onClick={() => setScale(scale + 0.1)}
            >
              <TwitIcon
                className={playoffStyle["playoffs__viewport__zoom__icon"]}
                icon="/sprites.svg#icon-zoom-in"
              />
            </div>
          </div>
        </div>
      </div>
      <TwitAlert
        show={showAlert}
        onHide={() => setShowAlert(false)}
        duration={3000}
        message="Saved"
      />
    </React.Fragment>
  );
}

export default Playoffs;
