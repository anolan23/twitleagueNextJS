import Leagues from "../../../../../db/repos/Leagues";

export default async (req, res) => {
  const method = req.method;
  const { leagueName, seasonId } = req.query;

  if (method === "POST") {
  } else if (method === "GET") {
    const format = await Leagues.getFormat(leagueName, seasonId);
    res.send(format);
  } else {
    res.status(405).json({
      message: "api/leagues/[leagueName]/format only supports GET",
    });
  }
};
