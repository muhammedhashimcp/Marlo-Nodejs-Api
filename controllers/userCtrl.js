const User = require('../model/User');
const expressAsyncHandler = require('express-async-handler');
const generateToken = require('../config/token/generateToken');
const validateMongodbId = require('../utils/validateMongodbID');
const isBlockedUser = require('../utils/isBlocked');
const formValidation = require('../utils/validation');
const updateFormValidation = require('../utils/updateFormValidation');

//  Register user controller
const userRegisterCtrl = expressAsyncHandler(async (req, res, next) => {
	const {
		firstName,
		middleName,
		lastName,
		DOB,
		phoneNumber,
		email,
		occupation,
		company,
		password,
		confirmPassword,
	} = req.body;
	let error = formValidation(
		firstName,
		lastName,
		email,
		DOB,
		phoneNumber,
		password,
		confirmPassword
	);
	if (error) {
		throw new Error(error);
	}
	//Check if user Exist
	const userExists = await User.findOne({
		$or: [{ email: email }, { phoneNumber: phoneNumber }],
	});
	// const userExists = await User.findOne({ email: req?.body?.email });
	if (userExists)
		throw new Error('User already exists with email or phone number');

	try {
		const user = await User.create({
			firstName: firstName,
			middleName: middleName,
			lastName: lastName,
			DOB: DOB,
			email: email,
			phoneNumber: phoneNumber,
			occupation: occupation,
			company: company,
			password: password,
		});

		res.json(user);
	} catch (error) {
		res.json({ error: error.message });
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
			middleName: userFound?.middleName,
			lastName: userFound?.lastName,
			email: userFound?.email,
			token: generateToken(userFound?._id),
		});
	} else {
		res.status(401);
		throw new Error(`Login credentials are not valid`);
	}
});
// Get All users
const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const users = await User.find({});
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

// Update User details
// This controller function is used to update any of the field we want to update according to requirement
const updateUserCtrl = expressAsyncHandler(async (req, res) => {
	// Prevent  user if blocked
	isBlockedUser(req?.user);
	const { _id } = req?.user;
	validateMongodbId(_id);
	const {
		firstName,
		middleName,
		lastName,
		DOB,
		phoneNumber,
		email,
		occupation,
		company,
	} = req.body;
	let error = updateFormValidation(
		firstName,
		lastName,
		email,
		DOB,
		phoneNumber
	);
	if (error) {
		throw new Error(error);
	}
	const user = await User.findByIdAndUpdate(
		_id,
		{
			firstName,
			middleName,
			lastName,
			email,
			DOB,
			phoneNumber,
			occupation,
			company
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
		//Note:- just pass the status for improving performance rather than the entire object 
		// res.json({updated:true})
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

module.exports = {
	userRegisterCtrl,
	userLoginCtrl,
	fetchUsersCtrl,
	fetchUserDetailsCtrl,
	updateUserCtrl,
	updateUserPasswordCtrl,
	blockUserCtrl,
	unBlockUserCtrl,
	deleteUserCtrl,
};
