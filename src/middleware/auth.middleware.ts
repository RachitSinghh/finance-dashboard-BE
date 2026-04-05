import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User, UserRole } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    if (user.status === "inactive") {
      throw new ApiError(403, "Your account is inactive. Please contact admin.");
    }

    (req as any).user = user;
    next();
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user?.role)) {
      throw new ApiError(
        403,
        `Role: ${(req as any).user?.role} is not allowed to access this resource`
      );
    }
    next();
  };
};
