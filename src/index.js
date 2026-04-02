import connectDB from "./db/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

console.log(`listening to ${PORT}`);

connectDB();
