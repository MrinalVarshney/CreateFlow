const LeaderBoard = require("../../models/Skribble/LeaderboardSchema");
const User = require("../../models/userSchema");

const addLeaderBoard = async (req,res) => {
    const {leaderBoard} = req.body;
    console.log("LeaderBoard details",leaderBoard);
    try {
        const players  = [];
        const scores = [];
        leaderBoard.map((player) => {
            players.push(player.userId);
            scores.push(player.score);
        })
        const new_leaderBoard = await LeaderBoard.create({
            players: players,
            scores: scores,
        });

        await new_leaderBoard.save();
        
        players.map(async (player) => {
            const user = await User.findById(player);
            user.GameHistory.push(new_leaderBoard._id);
            await user.save();
        })
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("Server Error");
    }
}

module.exports = addLeaderBoard;