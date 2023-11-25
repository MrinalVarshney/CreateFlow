const express = require("express")
const router = express.Router()
const userController = require("../controllers/user/userController")
const profileController = require("../controllers/profileController");
const protect = require("../middlewares/auth")

router.get("/searchUsers",protect,userController.getSearchUsers)
router.post('/favourites/add',protect,userController.addToFavourites)
router.delete("/favourites/remove",protect,userController.removeFromFavourites)
router.get("/getPendingInvitations",protect,userController.getPendingInvitations)
router.post("/updateProfile",protect,profileController);

module.exports =router