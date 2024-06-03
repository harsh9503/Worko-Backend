const express = require("express")
const router = express.Router()

const { login, signup, logout} = require("../controller/Auth")
const { auth, isAdmin, isUser } = require("../middleware/Auth")
const { getAlluser, getUser, updateUser, deleteUser}= require("../controller/User")

router.post("/login", login)
router.post("/signup", signup)
router.post("/logout",auth, logout)
router.get("/alluser", auth, isAdmin, getAlluser)
router.get("/getuser", auth, isUser, getUser )
router.patch("/updateuser", auth, isUser, updateUser)
router.delete("/deleteuser", auth, deleteUser)

module.exports = router
