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

    try {
      switch (filter) {
        case "users":
          const users = await Users.findAllLike(
            query.toLowerCase(),
            offset,
            limit
          );
          res.send(users);
          break;
        case "teams":
          const teams = await Teams.findAllLike(
            query.toLowerCase(),
            offset,
            limit
          );
          res.send(teams);
          break;
        case "leagues":
          const leagues = await Leagues.findAllLike(
            query.toLowerCase(),
            offset,
            limit
          );
          res.send(leagues);
          break;
        case "posts":
          const posts = await Posts.search(
            query.toLowerCase(),
            offset,
            limit,
            userId
          );
          res.send(posts);
          break;

        default:
          const results = await Database.search(query.toLowerCase());
          res.send(results);
          break;
      }
    } catch (error) {
      res.status(500).send({ status: 500, error });
    }
  } else {
    res.status(405).json({ message: "/api/search only supports GET methods" });
  }
};
