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