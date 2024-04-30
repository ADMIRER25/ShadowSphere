import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwtCookie;
  // console.log("req:", req);
  // console.log("req.cookies: ", req.cookies);
  // console.log("req.cookies.jwtCookie: ", req.cookies.jwtCookie);

  if (!token) {
    throw new ApiError(401, "Unauthorized-No Token Provided");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // console.log("decoded: ", decoded);

  if (!decoded) {
    throw new ApiError(401, "Unauthorized-Invalid Token");
  }
  const user = await User.findOne({_id:decoded.userId}).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  req.user = user;
  next();
});

export default protectRoute;
