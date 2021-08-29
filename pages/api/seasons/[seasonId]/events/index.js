import Events from "../../../../../db/repos/Events";

export default async (req, res) => {
  const { method } = req;
  const { seasonId } = req.query;
  if (method === "GET") {
    const events = await Events.findSeasonEvents(seasonId);
    res.send(events);
  } else {
    res
      .status(405)
      .json({ message: "api/seasons/[seasonId]/events only supports GET" });
  }
};
