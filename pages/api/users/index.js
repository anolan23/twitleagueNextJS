import { verify } from "jsonwebtoken";
import Users from "../../../db/repos/Users";
import Notifications from "../../../db/repos/Notifications";
import Followers from "../../../db/repos/Followers";

export default async (req, res) => {
  const { method, query } = req;
  const search = query.search ? query.search.toLowerCase() : null;
  if (method === "GET")
    if (search) {
      const users = await Users.findLike(search);
      res.send(users);
    } else {
      verify(
        req.cookies.auth,
        process.env.AUTH_TOKEN_SECRET,
        async function (err, payload) {
          if (!err && payload) {
            const { username } = payload;
            let foundUser = await Users.findOne(username);
            foundUser = { ...foundUser, isSignedIn: true };
            delete foundUser["password"];
            res.send(foundUser);
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
