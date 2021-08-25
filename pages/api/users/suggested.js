import Users from "../../../db/repos/Users";

export default async (req, res) => {
  const { method } = req;

  if (method === "GET") {
    const { userId, startIndex, stopIndex } = req.query;
    const offset = startIndex || null;
    const limit = stopIndex - startIndex || null;

    const users = await Users.findSuggested(userId, offset, limit);
    res.send(users);
  } else {
    res
      .status(405)
      .json({ message: "api/users/suggested only supports GET methods" });
  }
};
