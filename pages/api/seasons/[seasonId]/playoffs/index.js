import Playoffs from "../../../../../db/repos/Playoffs";

export default async (req, res) => {
  const { method } = req;
  const { seasonId } = req.query;
  if (method === "GET") {
    const playoffs = await Playoffs.findOne(seasonId);
    res.send(playoffs);
  } else if (method === "POST") {
    const playoffs = await Playoffs.create(seasonId);
    res.send(playoffs);
  } else if (method === "PATCH") {
    const { columns } = req.body;
    const playoffs = await Playoffs.update(seasonId, columns);
    res.send(playoffs);
  } else if (method === "DELETE") {
  } else {
    res.status(405).json({
      message: "api/seasons/[seasonId]/playoffs only supports GET, POST, PATCH",
    });
  }
};
