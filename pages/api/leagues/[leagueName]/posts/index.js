import Posts from "../../../../../db/repos/Posts";

export default async (req, res) => {
  const { method } = req;
  const { leagueName, filter, userId, startIndex, stopIndex } = req.query;

  if (method === "GET") {
    const offset = startIndex || null;
    const limit = stopIndex - startIndex || null;

    try {
      switch (filter) {
        case "media": {
          const posts = await Posts.findLeagueMedia(
            leagueName,
            userId,
            offset,
            limit
          );
          res.send(posts);
          break;
        }

        default: {
          const posts = await Posts.findByLeagueName(
            leagueName,
            userId,
            offset,
            limit
          );
          res.send(posts);
          break;
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: 500, error });
    }
  } else {
    res.status(405).json({
      message: "api/leagues/[leagueName]/posts only supports GET methods",
    });
  }
};
