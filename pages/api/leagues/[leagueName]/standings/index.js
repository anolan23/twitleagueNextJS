import Leagues from "../../../../../db/repos/Leagues";

export default async (req, res) => {
  const method = req.method;
  const { leagueName } = req.query;

  if (method === "POST") {
  } else if (method === "GET") {
    const standings = await Leagues.currentSeasonStandings(leagueName);
    res.send(standings);
  } else {
    res.status(405).json({
      message: "api/leagues/[leagueName]/standings only supports GET",
    });
  }
};
