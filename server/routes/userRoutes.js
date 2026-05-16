import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    getMyProfile,
    updateProfile,
    getUserProfile
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);

router.put("/me", protect, updateProfile);

router.get("/:username", getUserProfile);

export default router;