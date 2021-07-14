import Leagues from "../../../../../db/repos/Leagues";

export default async (req, res) => {
  const { method } = req;
  const { seasonId, leagueName } = req.query;
  if (method === "GET") {
    const playoffs = await Leagues.getLeaguePlayoff(leagueName, seasonId);
    res.send(playoffs);
  } else if (method === "POST") {
  } else if (method === "PATCH") {
  } else if (method === "DELETE") {
  } else {
    res.status(405).json({
      message: "api/leagues/[leagueName]/playoffs only supports GET",
    });
  }
};
