import Database from "../../../../db/repos/Database";
import Seasons from "../../../../db/repos/Seasons";

export default async (req, res) => {
  const { method } = req;
  const { seasonId } = req.query;
  const { columns } = req.body;
  if (method === "GET") {
    const season = await Seasons.findOne(seasonId);
    res.send(season);
  } else if (method === "POST") {
  } else if (method === "PATCH") {
    const season = Database.updateById(seasonId, "seasons", columns);
    res.send(season);
  } else {
    res
      .status(405)
      .json({ message: "api/seasons/[seasonId] only supports PATCH" });
  }
};
