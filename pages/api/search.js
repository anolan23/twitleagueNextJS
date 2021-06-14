import Database from "../../db/repos/Database";

export default async (req, res) => {
  const { method } = req;
  const { query } = req.query;
  if (method === "GET") {
    let q = query.toLowerCase();
    const result = await Database.searchAllLike(q);
    res.send(result);
  } else {
    res.status(405).json({ message: "api/search only supports GET method" });
  }
};
