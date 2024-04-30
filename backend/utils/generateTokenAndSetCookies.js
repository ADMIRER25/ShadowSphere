import jwt from "jsonwebtoken";

process.env.JWT_SECRET;

const generateTokenAndSetCookies = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwtCookie",token,{
    maxAge: 15 * 24 * 60 * 60 * 1000,// ms
    httpOnly: true, // only accessible by the web server
    secure: process.env.NODE_ENV !== "developement",// only send cookie over https
    sameSite:"strict", // only send cookie to the same domain
  })
};

export default generateTokenAndSetCookies;
