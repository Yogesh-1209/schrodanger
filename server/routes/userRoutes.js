import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    getMyProfile,
    updateProfile,
    getUserProfile
} from "../controllers/userController.js";

import {
    addFavoriteGame,
    removeFavoriteGame,
    getFavoriteGames
}
from "../controllers/userController.js";

import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
}
from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);

router.put("/me", protect, updateProfile);

router.get("/:username", getUserProfile);

// GET FAVORITES
router.get(
    "/favorites",
    protect,
    getFavoriteGames
);

// ADD FAVORITE
router.post(
    "/favorites",
    protect,
    addFavoriteGame
);

// REMOVE FAVORITE
router.delete(
    "/favorites/:gameId",
    protect,
    removeFavoriteGame
);

// FOLLOW USER
router.post(
    "/follow/:id",
    protect,
    followUser
);

// UNFOLLOW USER
router.post(
    "/unfollow/:id",
    protect,
    unfollowUser
);

// GET FOLLOWERS
router.get(
    "/followers/:id",
    getFollowers
);

// GET FOLLOWING
router.get(
    "/following/:id",
    getFollowing
);



export default router;