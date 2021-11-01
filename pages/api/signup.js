import Users from "../../db/repos/Users";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import cookie from "cookie";

export default async (req, res) => {
  const method = req.method;
  if (req.method === "POST") {
    const saltRounds = 11;
    const hashed = await hash(req.body.password, saltRounds);
    let user = req.body;
    user = { ...user, password: hashed };
    let createdUser = await Users.create(user);
    createdUser = { ...createdUser, isSignedIn: true };

    const claims = {
      sub: createdUser.id,
      username: createdUser.username,
    };
    const jwt = sign(claims, process.env.AUTH_TOKEN_SECRET, {
      expiresIn: "144h",
    });
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth", jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 360000,
        path: "/",
      })
    );

    res.send(createdUser);
  } else {
    res.status(405).json({ message: "api/signup only supports POST method" });
  }
};
