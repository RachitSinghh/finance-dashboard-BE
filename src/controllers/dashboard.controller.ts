import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Record, RecordType } from "../models/record.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getFinancialStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await Record.aggregate([
    {
      $group: {
        _id: "$type",
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const result = {
    income: 0,
    expense: 0,
    balance: 0,
  };

  stats.forEach((stat) => {
    if (stat._id === RecordType.INCOME) {
      result.income = stat.totalAmount;
    } else if (stat._id === RecordType.EXPENSE) {
      result.expense = stat.totalAmount;
    }
  });

  result.balance = result.income - result.expense;

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Financial stats fetched successfully"));
});

const getCategoryStats = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.query;

  const match: any = {};
  if (type) {
    match.type = type;
  }

  const stats = await Record.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, stats, "Category stats fetched successfully")
    );
});

const getMonthlyTrends = asyncHandler(async (req: Request, res: Response) => {
  const trends = await Record.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, trends, "Monthly trends fetched successfully"));
});

export { getFinancialStats, getCategoryStats, getMonthlyTrends };
