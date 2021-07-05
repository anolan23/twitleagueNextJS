import Seasons from "../../../../../db/repos/Seasons";

export default async (req, res) => {
  const method = req.method;
  const { leagueName } = req.query;
  if (method === "POST") {
  } else if (method === "GET") {
    const seasons = await Seasons.findByLeagueName(leagueName);
    res.send(seasons);
  } else {
    res
      .status(405)
      .json({ message: "api/leagues/[leagueName]/seasons only supports GET" });
  }
};
