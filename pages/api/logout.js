import cookie from "cookie";

export default async (req,res) => {
    res.setHeader('Set-Cookie', cookie.serialize('auth', '', {
          maxAge: -1,
          path: '/',
        }));
    res.send({isSignedIn:false});
}