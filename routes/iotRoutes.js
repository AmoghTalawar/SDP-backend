import express from "express";

const router = express.Router();
import {
  getIot
} from "../controllers/iotController.js";

router
  .route("/")
  .get(getIot);

export default router;
