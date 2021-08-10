import Users from "../../../../db/repos/Users";

export default async (req, res) => {
  const { method } = req;
  const { query } = req.query;
  if (method === "GET") {
    let q = query.toLowerCase();
    const users = await Users.findLike(q);
    res.send(users);
  } else {
    res.status(405).json({ message: "api/search only supports GET method" });
  }
};
