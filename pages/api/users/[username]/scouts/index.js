import Users from "../../../../../db/repos/Users";

export default async (req, res) => {
  const { method } = req;
  const { username, userId, startIndex, stopIndex } = req.query;

  if (method === "GET") {
    const offset = startIndex || null;
    const limit = stopIndex - startIndex || null;
    const scouts = await Users.findUserScouts(username, userId, offset, limit);
    res.send(scouts);
  } else {
    res.status(405).json({
      message: "api/users/[username]/scouts only supports GET methods",
    });
  }
};
