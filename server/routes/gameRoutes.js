const express = require("express")
const router = express.Router()
const gameController = require("../controllers/Skribble/gameController")

router.post("/addLeaderBoard", gameController.addLeaderBoard)

module.exports = router;
