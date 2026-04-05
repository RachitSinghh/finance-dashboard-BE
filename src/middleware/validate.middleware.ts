import type { Request, Response, NextFunction } from "express";
import type { AnyZodObject } from "zod";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors
          .map((err: any) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return next(new ApiError(400, errorMessage));
      }
      return next(error);
    }
  };
};
