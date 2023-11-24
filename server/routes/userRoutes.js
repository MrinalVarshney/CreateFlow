const express = require("express")
const router = express.Router()
const userController = require("../controllers/user/userController")

router.get("/searchUsers",userController.getSearchUsers)
router.post('/favourites/add',userController.addToFavourites)
router.delete("/favourites/remove",userController.removeFromFavourites)
router.get("/getPendingInvitations",userController.getPendingInvitations)

module.exports =router