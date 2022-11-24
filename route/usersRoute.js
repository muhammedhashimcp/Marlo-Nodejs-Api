const express = require("express");
const {
	userRegisterCtrl,
	userLoginCtrl,
	fetchUsersCtrl,
	fetchUserDetailsCtrl,
	updateUserCtrl,
	updateUserPasswordCtrl,
	blockUserCtrl,
	unBlockUserCtrl,
	deleteUserCtrl
} = require('../controllers/userCtrl');
const authMiddleware = require("../middleWares/auth/authMiddleware");



const userRoutes = express.Router();
 
userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", userLoginCtrl);
userRoutes.get("/", authMiddleware, fetchUsersCtrl);
userRoutes.get('/:id', fetchUserDetailsCtrl);
userRoutes.put('/', authMiddleware, updateUserCtrl);
userRoutes.put("/password", authMiddleware, updateUserPasswordCtrl)
userRoutes.put('/block-user/:id', authMiddleware, blockUserCtrl);
userRoutes.put('/unblock-user/:id', authMiddleware, unBlockUserCtrl);
userRoutes.delete("/:id", deleteUserCtrl);


module.exports = userRoutes;