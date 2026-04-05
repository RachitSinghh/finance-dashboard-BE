import { Router } from "express";
import {
  createRecord,
  deleteRecord,
  getRecordById,
  getRecords,
  updateRecord,
} from "../controllers/record.controller.js";
import { authorizeRoles, verifyJWT } from "../middleware/auth.middleware.js";
import { UserRole } from "../models/user.model.js";

import { recordSchema } from "../validators/index.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(authorizeRoles(UserRole.ANALYST, UserRole.ADMIN), getRecords)
  .post(authorizeRoles(UserRole.ADMIN), validate(recordSchema), createRecord);

router
  .route("/:id")
  .get(authorizeRoles(UserRole.ANALYST, UserRole.ADMIN), getRecordById)
  .patch(authorizeRoles(UserRole.ADMIN), updateRecord)
  .delete(authorizeRoles(UserRole.ADMIN), deleteRecord);

export default router;
