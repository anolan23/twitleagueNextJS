import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import useUser from "../../../../../../lib/useUser";
import { updatePlayoffs } from "../../../../../../actions";
import PlayoffRepo from "../../../../../../db/repos/Playoffs";
import playoffStyle from "../../../../../../sass/pages/Playoffs.module.scss";
import Bracket from "../../../../../../components/Bracket";
import NavBar from "../../../../../../components/NavBar";
import TwitButton from "../../../../../../components/TwitButton";
import TwitCard from "../../../../../../components/TwitCard";
import TwitItemSelect from "../../../../../../components/TwitItemSelect";
import TwitAlert from "../../../../../../components/TwitAlert";

function Playoffs({ playoffs }) {
  const { user } = useUser();
  const router = useRouter();
  const empty = [...Array(32)];
  const [seeds, setSeeds] = useState([]);
  const [bracket, setBracket] = useState(empty);
  const [inProgress, setInProgress] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (inProgress) {
      return;
    }
    constructBracketFromSeeds();
  }, [seeds]);

  useEffect(() => {
    if (!playoffs) {
      return;
    }
    console.log("playoffs changed");
    let { seeds, bracket, in_progress } = playoffs;
    if (!bracket || !seeds) {
      return;
    }
    const mappedSeeds = seeds.map((team) => {
      return { ...team, title: team.team_name, subtitle: team.abbrev };
    });
    setInProgress(in_progress);
    setSeeds(mappedSeeds);
    setBracket(bracket);
  }, [playoffs]);

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
    console.log("construct bracket");
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

    const savedPlayoffs = await updatePlayoffs(playoffs.season_id, {
      in_progress: inProgress,
      bracket: bracketArray,
      seeds: seedsArray,
    });

    setShowAlert(true);
  }

  async function start() {
    await save(bracket, seeds, true);
    setInProgress(true);
  }

  async function reset() {
    await save(null, [], false);
    setBracket(empty);
    setSeeds([]);
    setInProgress(false);
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
          Reset bracket
        </TwitButton>
      );
    }
  };

  const renderSeeds = () => {
    const getOptions = () => {
      if (!playoffs) {
        return [];
      } else if (!playoffs.league.teams) {
        return [];
      } else {
        return playoffs.league.teams.map((team) => {
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
                className={playoffStyle["playoffs__navbar__content__actions"]}
              >
                <TwitButton
                  color="primary"
                  onClick={() => save(bracket, seeds, inProgress)}
                >
                  Save
                </TwitButton>
                {renderStatusButton()}
              </div>
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
        <div className={playoffStyle["playoffs__viewport"]}>
          <Bracket seeds={seeds} bracket={bracket} advanceTeam={advanceTeam} />
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

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const { leagueName, seasonId } = context.params;
  let playoffs = await PlayoffRepo.findOne(seasonId);
  playoffs = JSON.parse(JSON.stringify(playoffs));

  return {
    revalidate: 1,
    props: {
      playoffs,
    },
  };
}

export default Playoffs;
