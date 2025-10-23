import express from "express";

const router = express.Router();

import {
  registerPatient,
  getAllPatient,
  getPatientByUser,
  updatePatient,
  allocatePatient,
  getUnallocatedPatients,
} from "../controllers/patientController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, registerPatient)
  .put(protect, updatePatient)
  .get(protect, getAllPatient);

router
  .route("/user")
  .get(protect, getPatientByUser)
  .put(protect, allocatePatient);

router.route("/getUnallocated").get(protect, getUnallocatedPatients);

export default router;
