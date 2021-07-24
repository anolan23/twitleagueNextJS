import Seasons from "../../../../db/repos/Seasons";

export default async (req, res) => {
  const method = req.method;
  const { leagueId } = req.query;
  if (method === "POST") {
    console.log(leagueId);
    const season = await Seasons.start(leagueId);
    res.send(season);
  } else if (method === "GET") {
  } else if (method === "PATCH") {
  } else {
    res.status(405).json({
      message: "api/seasons/start only supports POST, GET, PATCH methods",
    });
  }
};
