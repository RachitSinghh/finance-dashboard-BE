import { Router } from "express";
import {
  getCategoryStats,
  getFinancialStats,
  getMonthlyTrends,
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/stats", getFinancialStats);
router.get("/category-stats", getCategoryStats);
router.get("/trends", getMonthlyTrends);

export default router;
