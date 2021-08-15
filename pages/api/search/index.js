import Database from "../../../db/repos/Database";
import Users from "../../../db/repos/Users";
import Teams from "../../../db/repos/Teams";
import Leagues from "../../../db/repos/Leagues";
import Posts from "../../../db/repos/Posts";

export default async (req, res) => {
  const method = req.method;

  if (method === "GET") {
    const { query, filter, userId, startIndex, stopIndex } = req.query;
    const offset = startIndex ?? null;
    const limit = startIndex && stopIndex ? stopIndex - startIndex : null;
    const q = query.toLowerCase();

    try {
      switch (filter) {
        case "top":
          const top = await Posts.searchTop(q, offset, limit, userId);
          res.send(top);
          break;
        case "latest":
          const latest = await Posts.searchLatest(q, offset, limit, userId);
          res.send(latest);
          break;
        case "media":
          const media = await Posts.searchMedia(q, offset, limit, userId);
          res.send(media);
          break;
        case "users":
          const users = await Users.findAllLike(q, offset, limit);
          res.send(users);
          break;
        case "teams":
          const teams = await Teams.findAllLike(q, offset, limit);
          res.send(teams);
          break;
        case "leagues":
          const leagues = await Leagues.findAllLike(q, offset, limit);
          res.send(leagues);
          break;
        default:
          const results = await Database.search(q);
          res.send(results);
          break;
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: 500, error });
    }
  } else {
    res.status(405).json({ message: "/api/search only supports GET methods" });
  }
};
