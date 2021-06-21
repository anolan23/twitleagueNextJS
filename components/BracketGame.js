import { useEffect, useState } from "react";

import bracket from "../sass/components/Bracket.module.scss";

function BracketGame({ id, seeds }) {
  const [game, setGame] = useState({});

  useEffect(() => {
    setGame({});
    setIntialGame();
  }, [seeds]);

  function setIntialGame() {
    switch (seeds.length) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        if (id === 0) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        }
        break;
      case 3:
        if (id === 0) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: null,
          };
          setGame(game);
        } else if (id === 2) {
          const game = {
            topSlot: { team: seeds[2], seed: 2 },
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        }
        break;
      case 4:
        if (id === 1) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: { team: seeds[3], seed: 3 },
          };
          setGame(game);
        } else if (id === 2) {
          const game = {
            topSlot: { team: seeds[2], seed: 2 },
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        }
        break;
      case 5:
        if (id === 1) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: null,
          };
          setGame(game);
        } else if (id === 2) {
          const game = {
            topSlot: { team: seeds[2], seed: 2 },
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        } else if (id === 4) {
          const game = {
            topSlot: { team: seeds[4], seed: 4 },
            bottomSlot: { team: seeds[3], seed: 3 },
          };
          setGame(game);
        }
        break;
      case 5:
        if (id === 1) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: null,
          };
          setGame(game);
        } else if (id === 2) {
          const game = {
            topSlot: { team: seeds[2], seed: 2 },
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        } else if (id === 4) {
          const game = {
            topSlot: { team: seeds[4], seed: 4 },
            bottomSlot: { team: seeds[3], seed: 3 },
          };
          setGame(game);
        }
        break;
      case 5:
        if (id === 1) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: null,
          };
          setGame(game);
        } else if (id === 2) {
          const game = {
            topSlot: { team: seeds[2], seed: 2 },
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        } else if (id === 4) {
          const game = {
            topSlot: { team: seeds[4], seed: 4 },
            bottomSlot: { team: seeds[3], seed: 3 },
          };
          setGame(game);
        }
        break;
      case 5:
        if (id === 1) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: null,
          };
          setGame(game);
        } else if (id === 2) {
          const game = {
            topSlot: { team: seeds[2], seed: 2 },
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        } else if (id === 4) {
          const game = {
            topSlot: { team: seeds[4], seed: 4 },
            bottomSlot: { team: seeds[3], seed: 3 },
          };
          setGame(game);
        }
        break;
      case 5:
        if (id === 1) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: null,
          };
          setGame(game);
        } else if (id === 2) {
          const game = {
            topSlot: { team: seeds[2], seed: 2 },
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        } else if (id === 4) {
          const game = {
            topSlot: { team: seeds[4], seed: 4 },
            bottomSlot: { team: seeds[3], seed: 3 },
          };
          setGame(game);
        }
        break;
      case 6:
        if (id === 1) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: null,
          };
          setGame(game);
        } else if (id === 2) {
          const game = {
            topSlot: null,
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        } else if (id === 4) {
          const game = {
            topSlot: { team: seeds[4], seed: 4 },
            bottomSlot: { team: seeds[3], seed: 3 },
          };
          setGame(game);
        } else if (id === 5) {
          const game = {
            topSlot: { team: seeds[2], seed: 2 },
            bottomSlot: { team: seeds[5], seed: 5 },
          };
          setGame(game);
        }
        break;
      case 7:
        if (id === 1) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: null,
          };
          setGame(game);
        } else if (id === 4) {
          const game = {
            topSlot: { team: seeds[4], seed: 4 },
            bottomSlot: { team: seeds[3], seed: 3 },
          };
          setGame(game);
        } else if (id === 5) {
          const game = {
            topSlot: { team: seeds[2], seed: 2 },
            bottomSlot: { team: seeds[5], seed: 5 },
          };
          setGame(game);
        } else if (id === 6) {
          const game = {
            topSlot: { team: seeds[6], seed: 6 },
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        }
        break;
      case 8:
        if (id === 3) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: { team: seeds[7], seed: 7 },
          };
          setGame(game);
        } else if (id === 4) {
          const game = {
            topSlot: { team: seeds[4], seed: 4 },
            bottomSlot: { team: seeds[3], seed: 3 },
          };
          setGame(game);
        } else if (id === 5) {
          const game = {
            topSlot: { team: seeds[2], seed: 2 },
            bottomSlot: { team: seeds[5], seed: 5 },
          };
          setGame(game);
        } else if (id === 6) {
          const game = {
            topSlot: { team: seeds[6], seed: 6 },
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        }
        break;
      case 9:
        if (id === 3) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: null,
          };
          setGame(game);
        } else if (id === 4) {
          const game = {
            topSlot: { team: seeds[4], seed: 4 },
            bottomSlot: { team: seeds[3], seed: 3 },
          };
          setGame(game);
        } else if (id === 5) {
          const game = {
            topSlot: { team: seeds[2], seed: 2 },
            bottomSlot: { team: seeds[5], seed: 5 },
          };
          setGame(game);
        } else if (id === 6) {
          const game = {
            topSlot: { team: seeds[6], seed: 6 },
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        } else if (id === 8) {
          const game = {
            topSlot: { team: seeds[8], seed: 8 },
            bottomSlot: { team: seeds[7], seed: 7 },
          };
          setGame(game);
        }
        break;
      case 10:
        if (id === 3) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: null,
          };
          setGame(game);
        } else if (id === 4) {
          const game = {
            topSlot: { team: seeds[4], seed: 4 },
            bottomSlot: { team: seeds[3], seed: 3 },
          };
          setGame(game);
        } else if (id === 5) {
          const game = {
            topSlot: { team: seeds[2], seed: 2 },
            bottomSlot: { team: seeds[5], seed: 5 },
          };
          setGame(game);
        } else if (id === 6) {
          const game = {
            topSlot: null,
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        } else if (id === 8) {
          const game = {
            topSlot: { team: seeds[8], seed: 8 },
            bottomSlot: { team: seeds[7], seed: 7 },
          };
          setGame(game);
        } else if (id === 13) {
          const game = {
            topSlot: { team: seeds[6], seed: 6 },
            bottomSlot: { team: seeds[9], seed: 9 },
          };
          setGame(game);
        }
        break;
      case 11:
        if (id === 3) {
          const game = {
            topSlot: { team: seeds[0], seed: 0 },
            bottomSlot: null,
          };
          setGame(game);
        } else if (id === 4) {
          const game = {
            topSlot: { team: seeds[4], seed: 4 },
            bottomSlot: { team: seeds[3], seed: 3 },
          };
          setGame(game);
        } else if (id === 5) {
          const game = {
            topSlot: { team: seeds[2], seed: 2 },
            bottomSlot: null,
          };
          setGame(game);
        } else if (id === 6) {
          const game = {
            topSlot: null,
            bottomSlot: { team: seeds[1], seed: 1 },
          };
          setGame(game);
        } else if (id === 8) {
          const game = {
            topSlot: { team: seeds[8], seed: 8 },
            bottomSlot: { team: seeds[7], seed: 7 },
          };
          setGame(game);
        } else if (id === 12) {
          const game = {
            topSlot: { team: seeds[10], seed: 10 },
            bottomSlot: { team: seeds[5], seed: 5 },
          };
          setGame(game);
        } else if (id === 13) {
          const game = {
            topSlot: { team: seeds[6], seed: 6 },
            bottomSlot: { team: seeds[9], seed: 9 },
          };
          setGame(game);
        }
        break;
      default:
        break;
    }
  }

  console.log(game);
  return (
    <div className={bracket["bracket__round__game"]} id={id}>
      <div
        className={`${bracket["bracket__round__game__slot"]} ${bracket["bracket__round__game__slot--top"]}`}
      >
        <div className={bracket["bracket__round__game__slot__seed"]}>
          {game.topSlot ? game.topSlot.seed + 1 : null}
        </div>
        <div className={bracket["bracket__round__game__slot__team"]}>
          {game.topSlot ? game.topSlot.team.team_name : null}
        </div>
        <div className={bracket["bracket__round__game__slot__score"]}>
          {game.topSlot ? game.topSlot.team.score : null}
        </div>
      </div>
      <div
        className={`${bracket["bracket__round__game__slot"]} ${bracket["bracket__round__game__slot--bottom"]}`}
      >
        <div className={bracket["bracket__round__game__slot__seed"]}>
          {game.bottomSlot ? game.bottomSlot.seed + 1 : null}
        </div>
        <div className={bracket["bracket__round__game__slot__team"]}>
          {game.bottomSlot ? game.bottomSlot.team.team_name : null}
        </div>
        <div className={bracket["bracket__round__game__slot__score"]}>
          {game.bottomSlot ? game.bottomSlot.team.score : null}
        </div>
      </div>
    </div>
  );
}
export default BracketGame;
