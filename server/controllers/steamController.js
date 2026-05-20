import axios from "axios";

import User from "../models/User.js";
import Game from "../models/Game.js";
import UserGame from "../models/UserGame.js";

export const syncSteamGames = async (req, res) => {
    try {

        // logged in user
        const user = await User.findById(req.user._id);

        if (!user || !user.steamId) {
            return res.status(400).json({
                message: "Steam ID not connected"
            });
        }

        const apiKey = process.env.STEAM_API_KEY;

        // Steam API URL
        const url = `
https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${user.steamId}&include_appinfo=true&include_played_free_games=true
`;

        // fetch games
        const response = await axios.get(url);

        const games =
    (response.data.response.games || []).slice(0, 5);

        // loop through games
        for (const game of games) {

            // check existing game
            let existingGame =
                await Game.findOne({
                    steamAppId: game.appid
                });

            // create game if not exists
            if (!existingGame) {

                existingGame = await Game.create({
                    title: game.name,
                    steamAppId: game.appid,
                    platforms: ["Steam"]
                });

            }

            // check if user already owns game
            let userGame =
                await UserGame.findOne({
                    userId: user._id,
                    gameId: existingGame._id
                });

            // create/update user game
            if (!userGame) {

                await UserGame.create({
                    userId: user._id,
                    gameId: existingGame._id,
                    platform: "Steam",
                    hoursPlayed:
                        game.playtime_forever / 60
                });

            } else {

                userGame.hoursPlayed =
                    game.playtime_forever / 60;

                await userGame.save();
            }
        }

        res.status(200).json({
            message: "Steam games synced successfully",
            totalGames: games.length
        });

    } catch (error) {

    console.log(error);

    res.status(500).json({
        error: error.message,
        fullError: error
    });

}
};