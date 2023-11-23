import express from "express";

const router = express.Router();

import {
    registerLocation,
    getLocations,
    updateLocation
} from "../controllers/locationController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

router
    .route("/")
    .post(protect, admin, registerLocation)
    .get(protect, admin, getLocations);


router
    .route("/:id")
    .put(protect, admin, updateLocation)
    

export default router;
