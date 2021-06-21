import React, { useEffect, useState } from "react";

import Leagues from "../../../../db/repos/Leagues";
import playoffs from "../../../../sass/pages/Playoffs.module.scss";
import Bracket from "../../../../components/Bracket";
import NavBar from "../../../../components/NavBar";
import TwitButton from "../../../../components/TwitButton";
import TwitCard from "../../../../components/TwitCard";
import TwitItemSelect from "../../../../components/TwitItemSelect";
import { numberSuffix } from "../../../../lib/twit-helpers";

function Playoffs({ league }) {
  const [seeds, setSeeds] = useState([{}, {}, {}, {}]);

  function onSeedSelect(option, index) {
    let newSeeds = [...seeds];
    newSeeds[index] = option;
    setSeeds(newSeeds);
  }

  const renderFooter = () => {
    return (
      <div className={playoffs["playoffs__sidebar__footer"]}>
        <TwitButton
          color="primary"
          onClick={() => setSeeds([...seeds, {}])}
          expanded
        >
          Add
        </TwitButton>
        <TwitButton
          color="primary"
          onClick={() =>
            setSeeds(seeds.filter((_, index) => index !== seeds.length - 1))
          }
          expanded
        >
          Remove
        </TwitButton>
      </div>
    );
  };

  const renderSeeds = () => {
    const getOptions = () => {
      if (!league) {
        return [];
      } else if (!league.teams) {
        return [];
      } else {
        const filteredTeams = league.teams.filter((team) => {
          const seed = seeds.find((seed) => seed.id === team.id);
          return !seed;
        });
        return filteredTeams.map((team) => {
          return { ...team, title: team.team_name, subtitle: team.abbrev };
        });
      }
    };
    const options = getOptions();
    return seeds.map((seed, index) => {
      return (
        <TwitItemSelect
          key={index}
          options={options}
          defaultValue={`${numberSuffix(index + 1)} Seed`}
          onSelect={(option) => onSeedSelect(option, index)}
        />
      );
    });
  };

  return (
    <div className={playoffs["playoffs"]}>
      <div className={playoffs["playoffs__navbar"]}>
        <NavBar title="twitleague"></NavBar>
      </div>
      <div className={playoffs["playoffs__sidebar"]}>
        <div className={playoffs["playoffs__sidebar__content"]}>
          <TwitCard color="clear" title="Playoff teams" footer={renderFooter()}>
            {renderSeeds()}
          </TwitCard>
        </div>
      </div>
      <div className={playoffs["playoffs__viewport"]}>
        <Bracket seeds={seeds} />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const leagueName = context.params.leagueName;
  let league = await Leagues.findOne(leagueName);
  league = JSON.parse(JSON.stringify(league));

  return {
    revalidate: 1,
    props: {
      league,
    },
  };
}

export default Playoffs;
