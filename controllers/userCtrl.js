const User = require('../model/User');
const expressAsyncHandler = require('express-async-handler');
const generateToken = require('../config/token/generateToken');
const validateMongodbId = require('../utils/validateMongodbID');
const blockUser = require('../utils/isBlock');

//  Register user controller    
const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
	//business logic
	//Check if user Exist
	const userExists = await User.findOne({ email: req?.body?.email });
	if (userExists) throw new Error('User already exists');
	try {
		const user = await User.create({
			firstName: req?.body?.firstName,
			lastName: req?.body?.lastName,
			email: req?.body?.email,
			password: req?.body?.password,
		});
		res.json(user);
	} catch (error) {
		res.json({ error: error });
	}
});
//  Login user controller    
const userLoginCtrl = expressAsyncHandler(async (req, res) => {
	const { email, password } = req.body;
	//check if user exists
	const userFound = await User.findOne({ email });
	if (userFound?.isBlocked) {
		throw new Error('Access Denied You have been blocked');
	}
	//Check if password is match
	const isMatched = await userFound?.isPasswordMatched(password);
	if (userFound && isMatched) {
		res.json({
			_id: userFound?._id,
			firstName: userFound?.firstName,
			lastName: userFound?.lastName,
			email: userFound?.email,
			profilePhoto: userFound?.profilePhoto,
			isAdmin: userFound?.isAdmin,
			token: generateToken(userFound?._id),
			isVerified: userFound?.isAccountVerified,
		});
	} else {
		res.status(401);
		throw new Error(`Login credentials are not valid`);
	}
});
// Get All users
const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const users = await User.find({})
		res.json(users);
	} catch (error) {
		res.json(error);
	}
});
// Get an user details
const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	//check if user id is valid
	validateMongodbId(id);
	try {
		const user = await User.findOne({ id });
		res.json(user);
	} catch (error) {
		res.json(error);
	}
});

// Delete user
const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	//check if user id is valid
	validateMongodbId(id);
	try {
		const deleteUser = await User.findByIdAndDelete(id);
		res.json(deleteUser);
	} catch (error) {
		res.json(error);
	}
});


// Update User details 
const updateUserCtrl = expressAsyncHandler(async (req, res) => {
	// Prevent  user if blocked
	blockUser(req?.user);
	const { _id } = req?.user;
	validateMongodbId(_id);
	const user = await User.findByIdAndUpdate(
		_id,
		{
			firstName: req?.body?.firstName,
			lastName: req?.body?.lastName,
			email: req?.body?.email,
			bio: req?.body?.bio,
		},
		{
			new: true,
			runValidators: true,
		}
	);
	res.json(user);
});
// update User password    
const updateUserPasswordCtrl = expressAsyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongodbId(_id);
	const { password } = req.body;
	// Find the user by id
	const user = await User.findById(_id);
	if (password) {
		user.password = password;
		const updatedUser = await user.save();
		res.json(updatedUser);
	} else {
		res.json(user);
	}
});  
//  Block User 
const blockUserCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);

	const user = await User.findByIdAndUpdate(
		id,
		{
			isBlocked: true,
		},
		{ new: true }
	);
	res.json(user);
});
//  Unblock User 
const unBlockUserCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);

	const user = await User.findByIdAndUpdate(
		id,
		{
			isBlocked: false,
		},
		{ new: true }
	);
	res.json(user);
});

module.exports = {
	userRegisterCtrl,
	userLoginCtrl,
	fetchUsersCtrl,
	fetchUserDetailsCtrl,
	updateUserCtrl,
	updateUserPasswordCtrl,
	blockUserCtrl,
	unBlockUserCtrl,
	deleteUserCtrl
};