const mongoose = require("mongoose");

const LeaderBoardSchema = mongoose.Schema( 
    {
        roomCode: {type: String, required: true},
        players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        scores: [{ type: Number }],
    },
    {
        timestamps: true
    }
);

const LeaderBoard = mongoose.model("LeaderBoard", LeaderBoardSchema);

module.exports = LeaderBoard;
