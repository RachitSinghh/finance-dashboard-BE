import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User, UserRole } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    role: role || UserRole.VIEWER,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(String(user._id));

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(
    (req as any).user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, (req as any).user, "User fetched successfully"));
});

const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { userId, role } = req.body;

  if (!Object.values(UserRole).includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        role,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User role updated successfully"));
});

const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { userId, status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        status,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User status updated successfully"));
});

export { registerUser, loginUser, logoutUser, getCurrentUser, updateUserRole, updateUserStatus };
