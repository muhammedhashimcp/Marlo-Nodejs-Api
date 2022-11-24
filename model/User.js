const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
//create schema
const userSchema = new mongoose.Schema(
	{
		firstName: {
			required: [true, 'First name is required'],
			type: String,
		},
		middleName: {
			type: String,
		},
		lastName: {
			required: [true, 'Last name is required'],
			type: String,
		},
		// converting our date into ISODate using new Date("<YYYY-mm-dd>")
		DOB: {
			type: Date,
		},

		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
		},
		phoneNumber: {
			type: Number,
			required: [true, 'Phone Number is required'],
			unique: true,
		},
		occupation: {
			type: String,
		},
		company: {
			type: String,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

//Hash password
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	//hash password
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});
//match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

//Compile schema into model
const User = mongoose.model('User', userSchema);

module.exports = User;
