import express from "express";

const router = express.Router();

import {
  soberPeriodPrediction,
  aaiPrediction,
  riskPrediction,
} from "../controllers/predictionController.js";

router.route("/soberPeriod").post(soberPeriodPrediction);
router.route("/aaiPrediction").post(aaiPrediction);
router.route("/riskPrediction").post(riskPrediction);

export default router;
