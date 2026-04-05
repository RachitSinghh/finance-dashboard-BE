import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Record } from "../models/record.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createRecord = asyncHandler(async (req: Request, res: Response) => {
  const { amount, type, category, date, description } = req.body;

  if (!amount || !type || !category) {
    throw new ApiError(400, "Amount, type and category are required");
  }

  const record = await Record.create({
    amount,
    type,
    category,
    date: date || new Date(),
    description,
    owner: (req as any).user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, record, "Record created successfully"));
});

const getRecords = asyncHandler(async (req: Request, res: Response) => {
  const { category, type, startDate, endDate, page = 1, limit = 10 } = req.query;

  const query: any = {};

  if (category) {
    query.category = category;
  }

  if (type) {
    query.type = type;
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = new Date(startDate as string);
    }
    if (endDate) {
      query.date.$lte = new Date(endDate as string);
    }
  }

  const records = await Record.find(query)
    .sort({ date: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Record.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        records,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
      "Records fetched successfully"
    )
  );
});

const getRecordById = asyncHandler(async (req: Request, res: Response) => {
  const record = await Record.findById(req.params.id);

  if (!record) {
    throw new ApiError(404, "Record not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, record, "Record fetched successfully"));
});

const updateRecord = asyncHandler(async (req: Request, res: Response) => {
  const { amount, type, category, date, description } = req.body;

  const record = await Record.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        amount,
        type,
        category,
        date,
        description,
      },
    },
    { new: true }
  );

  if (!record) {
    throw new ApiError(404, "Record not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, record, "Record updated successfully"));
});

const deleteRecord = asyncHandler(async (req: Request, res: Response) => {
  const record = await Record.findByIdAndDelete(req.params.id);

  if (!record) {
    throw new ApiError(404, "Record not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Record deleted successfully"));
});

export { createRecord, getRecords, getRecordById, updateRecord, deleteRecord };
