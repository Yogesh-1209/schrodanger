import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
        default: ""
    },
     
    bio: {
    type: String,
    default: ""
    },

    avatar: {
    type: String,
    default: ""
    },

    banner: {
    type: String,
    default: ""
    },

    steamId: {
    type: String,
    default: ""
    },

    favoriteGenres: {
    type: [String],
    default: []
    }

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;