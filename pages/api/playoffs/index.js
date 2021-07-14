import Playoffs from "../../../db/repos/Playoffs";

export default async (req, res) => {
  const { method } = req;
  const { seasonId } = req.query;
  if (method === "GET") {
    const playoffs = await Playoffs.findOne(seasonId);
    res.send(playoffs);
  } else if (method === "POST") {
    const { playoffs } = req.body;
    const results = await Playoffs.create(seasonId, playoffs);
    res.send(results);
  } else if (method === "PATCH") {
    const { columns } = req.body;
    const playoffs = await Playoffs.update(seasonId, columns);
    res.send(playoffs);
  } else if (method === "DELETE") {
    const playoffs = await Playoffs.delete(seasonId);
    res.send(playoffs);
  } else {
    res.status(405).json({
      message: "api/playoffs only supports GET, POST, PATCH, DELETE",
    });
  }
};
