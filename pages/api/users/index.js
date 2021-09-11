import { verify } from "jsonwebtoken";
import Users from "../../../db/repos/Users";
import Notifications from "../../../db/repos/Notifications";
import Followers from "../../../db/repos/Followers";

export default async (req, res) => {
  const method = req.method;
  const search = req.query.search ? req.query.search.toLowerCase() : null;
  if (method === "GET")
    if (search) {
      const users = await Users.findLike(search);
      res.send(users);
    } else {
      verify(
        req.cookies.auth,
        process.env.AUTH_TOKEN_SECRET,
        async function (err, decoded) {
          if (!err && decoded) {
            const username = decoded.username;
            let user = await Users.findOne(username);
            user = { ...user, isSignedIn: true };
            delete user["password"];
            res.send(user);
          } else {
            res.send({ isSignedIn: false });
          }
        }
      );
    }
  else if (method === "PATCH") {
    const userId = req.body.userId;
    const values = req.body.values;
    const user = await Users.update(userId, values);
    res.send(user);
  } else {
    res.status(405).json({ message: "/users only supports GET/PATCH method" });
  }
};
