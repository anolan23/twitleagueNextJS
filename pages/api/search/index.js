import Database from "../../../db/repos/Database";

export default async (req, res) => {
  const method = req.method;

  if (method === "GET") {
    const { query } = req.query;
    try {
      const results = await Database.search(query);
      res.send(results);
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(405).json({ message: "/api/search only supports GET methods" });
  }
};
