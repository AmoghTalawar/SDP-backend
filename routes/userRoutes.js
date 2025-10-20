import express from "express";

const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  sendResetPassword,
  resetPassword
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/")
.post(registerUser)
.get(protect, admin, getUsers);

router.post("/login", authUser);

router.route("/sendresetlink").post(sendResetPassword);

router
  .route("/profile")
  .get(protect, getUserProfile);

router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

router.route("/reset/:token").post(resetPassword);

export default router;
