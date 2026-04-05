import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
import recordRouter from "./routes/record.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/records", recordRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export { app };
