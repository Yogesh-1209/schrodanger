import User from "../models/User.js";


// GET CURRENT LOGGED IN USER PROFILE
export const getMyProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};


// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {

        const {
            bio,
            avatar,
            banner,
            steamId,
            favoriteGenres
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.bio = bio || user.bio;
        user.avatar = avatar || user.avatar;
        user.banner = banner || user.banner;
        user.steamId = steamId || user.steamId;

        if (favoriteGenres) {
            user.favoriteGenres = favoriteGenres;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                avatar: updatedUser.avatar,
                banner: updatedUser.banner,
                steamId: updatedUser.steamId,
                favoriteGenres: updatedUser.favoriteGenres
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};


// GET PUBLIC PROFILE BY USERNAME
export const getUserProfile = async (req, res) => {
    try {

        const user = await User.findOne({
            username: req.params.username
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};

export const addFavoriteGame = async (req, res) => {
    try {

        const { gameId } = req.body;

        const user = await User.findById(req.user._id);

        // check if already favorited
        if (
            user.favoriteGames.includes(gameId)
        ) {
            return res.status(400).json({
                message: "Game already in favorites"
            });
        }

        user.favoriteGames.push(gameId);

        await user.save();

        res.status(200).json({
            message: "Game added to favorites"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to add favorite"
        });

    }
};


export const removeFavoriteGame = async (req, res) => {
    try {

        const { gameId } = req.params;

        const user = await User.findById(req.user._id);

        user.favoriteGames =
            user.favoriteGames.filter(
                (id) => id.toString() !== gameId
            );

        await user.save();

        res.status(200).json({
            message: "Favorite removed"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to remove favorite"
        });

    }
};

export const getFavoriteGames = async (req, res) => {
    try {

        const user = await User.findById(req.user._id)
            .populate("favoriteGames");

        res.status(200).json(
            user.favoriteGames
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch favorites"
        });

    }
};

export const followUser = async (req, res) => {
    try {

        // user to follow
        const userToFollow =
            await User.findById(req.params.id);

        // current logged in user
        const currentUser =
            await User.findById(req.user._id);

        // check user exists
        if (!userToFollow) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // prevent self follow
        if (
            userToFollow._id.toString() ===
            currentUser._id.toString()
        ) {
            return res.status(400).json({
                message:
                    "You cannot follow yourself"
            });
        }

        // initialize arrays if missing
        if (!currentUser.following) {
            currentUser.following = [];
        }

        if (!userToFollow.followers) {
            userToFollow.followers = [];
        }

        // check already following
        const alreadyFollowing =
            currentUser.following.some(
                (id) =>
                    id.toString() ===
                    userToFollow._id.toString()
            );

        if (alreadyFollowing) {
            return res.status(400).json({
                message:
                    "Already following user"
            });
        }

        // add following
        currentUser.following.push(
            userToFollow._id
        );

        // add follower
        userToFollow.followers.push(
            currentUser._id
        );

        // save both users
        await currentUser.save();

        await userToFollow.save();

        res.status(200).json({
            message:
                "User followed successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: error.message
        });

    }
};
export const unfollowUser = async (req, res) => {
    try {

        const userToUnfollow =
            await User.findById(req.params.id);

        const currentUser =
            await User.findById(req.user._id);

        if (!userToUnfollow) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        currentUser.following =
            currentUser.following.filter(
                (id) =>
                    id.toString() !==
                    userToUnfollow._id.toString()
            );

        userToUnfollow.followers =
            userToUnfollow.followers.filter(
                (id) =>
                    id.toString() !==
                    currentUser._id.toString()
            );

        await currentUser.save();
        await userToUnfollow.save();

        res.status(200).json({
            message: "User unfollowed successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unfollow failed"
        });

    }
};

export const getFollowers = async (req, res) => {
    try {

        const user = await User.findById(
            req.params.id
        ).populate(
            "followers",
            "username avatar"
        );

        res.status(200).json(
            user.followers
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch followers"
        });

    }
};

export const getFollowing = async (req, res) => {
    try {

        const user = await User.findById(
            req.params.id
        ).populate(
            "following",
            "username avatar"
        );

        res.status(200).json(
            user.following
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch following"
        });

    }
};