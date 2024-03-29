import Events from "../../../../db/repos/Events";
import Database from "../../../../db/repos/Database";

export default async (req, res) => {
  const method = req.method;
  const { eventId, userId } = req.query;
  if (method === "POST") {
  } else if (method === "GET") {
    const event = await Events.findOneEventById(eventId, userId);
    res.send(event);
  } else if (method === "PATCH") {
    const { columns } = req.body;
    const event = await Database.updateById(eventId, "events", columns);
    res.send(event);
  } else {
    res.status(405).json({
      message: "api/events/:eventId only supports POST, GET, PATCH methods",
    });
  }
};
