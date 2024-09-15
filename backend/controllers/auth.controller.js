import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import generateTokenAndSetCookies from "../utils/generateTokenAndSetCookies.js";
import bcrypt from "bcrypt";

const signupUser = asyncHandler(async (req, res) => {
  const { fullName, username, password, confirmPassword, gender } = req.body;
  // console.log(fullName,username,password,gender);
  // if (!fullName || !username || !password || !gender) {
  //   return res
  //     .status(400)
  //     .json({ error: "All required fields must be provided correctly." });
  // }
  if (password !== confirmPassword) {
    throw new ApiError(400, "password and confirm password are not same!!!");
  }

  if (
    [fullName, username, password, gender].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!!!");
  }

  const user = await User.findOne({ username:username.toLowerCase() });
  if (user) {
    throw new ApiError(400, "username already exists!!!");
  }

  const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

  const newUser = await User.create({
    fullName,
    username: username?.toLowerCase(),
    password,
    gender,
    profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
  });

  //await newUser.save();
  const registerUser = await User.findOne({ _id: newUser._id }).select(
    "-password"
  );

  if (!registerUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  } else {
    generateTokenAndSetCookies(newUser._id, res);
  }

  return res
    .status(201)
    .json(new ApiResponse(200, registerUser, "User Registered SuccessFully!!"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(400, "username not found!!");
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user?.password || ""
  );
  if (!isPasswordCorrect) {
    throw new ApiError(400, "password is incorrect");
  }
  generateTokenAndSetCookies(user._id, res);
  const registeredUser = await User.findById(user._id).select("-password");
  if (!registeredUser) {
    throw new ApiError(500, "Internal Server Error!!!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, registeredUser, "User logged in Successfully"));
});

const logoutUser = (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("jwtCookie", {
        httpOnly: true, // only accessible by the web server
        secure: process.env.NODE_ENV !== "developement", // only send cookie over https
        sameSite: "strict", // only send cookie to the same domain
      })
      .json(new ApiResponse(200, "User logged out successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Internal Server error!!!");
  }
};

export { signupUser, loginUser, logoutUser };
