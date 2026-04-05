import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getCurrentUser,
  updateUserRole,
  updateUserStatus,
} from "../controllers/user.controller.js";
import { authorizeRoles, verifyJWT } from "../middleware/auth.middleware.js";
import { UserRole } from "../models/user.model.js";

import { validate } from "../middleware/validate.middleware.js";
import {
  loginSchema,
  registerSchema,
  updateRoleSchema,
  updateStatusSchema,
} from "../validators/index.js";

const router = Router();

router.route("/register").post(validate(registerSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);

// admin routes
router
  .route("/update-role")
  .patch(verifyJWT, authorizeRoles(UserRole.ADMIN), validate(updateRoleSchema), updateUserRole);
router
  .route("/update-status")
  .patch(verifyJWT, authorizeRoles(UserRole.ADMIN), validate(updateStatusSchema), updateUserStatus);

export default router;
