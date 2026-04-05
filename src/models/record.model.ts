import mongoose, { Schema, Document } from "mongoose";

export enum RecordType {
  INCOME = "income",
  EXPENSE = "expense",
}

export interface IRecord extends Document {
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  description?: string;
  owner: mongoose.Types.ObjectId;
}

const recordSchema = new Schema<IRecord>(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    type: {
      type: String,
      enum: Object.values(RecordType),
      required: [true, "Type (income/expense) is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Record = mongoose.model<IRecord>("Record", recordSchema);
