import mongoose, { Schema, Document } from "mongoose";
import type { SaveOptions } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DB_NAME } from "../constant.js";

export enum UserRole {
  VIEWER = "Viewer",
  ANALYST = "Analyst",
  ADMIN = "Admin",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  refreshToken?: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.VIEWER,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (this: IUser, next: any) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  this: IUser,
  password: string
) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (this: IUser) {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any,
    }
  );
};

userSchema.methods.generateRefreshToken = function (this: IUser) {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any,
    }
  );
};

export const User = mongoose.model<IUser>("User", userSchema);
