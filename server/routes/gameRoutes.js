const express = require("express")
const router = express.Router()
const gameController = require("../controllers/Skribble/gameController")
const protect = require("../middlewares/auth")

router.post("/addLeaderBoard",protect, gameController.addLeaderBoard)

module.exports = router;
