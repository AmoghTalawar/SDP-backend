import express from "express";

const router = express.Router();

import {
    getAllCamp,
    registerCamp,
    getCampByUser,
    updateCamp
} from "../controllers/campController.js"

import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, admin, registerCamp)
  .get(protect, admin, getAllCamp);

router
  .route("/:id")
  .put(protect, admin, updateCamp);

router
  .route("/user")
  .get(protect, getCampByUser);

export default router;
