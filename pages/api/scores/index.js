import Events from "../../../db/repos/Events";

export default async (req, res) => {
  const method = req.method;
  const { seasonId } = req.query;

  if (method === "POST") {
  } else if (method === "GET") {
    const scores = await Events.scores(seasonId);
    res.send(scores);
  } else if (method === "PATCH") {
  } else {
    res.status(405).json({ message: "api/scores only supports GET methods" });
  }
};
