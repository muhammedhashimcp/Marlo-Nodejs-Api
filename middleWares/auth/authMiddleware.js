const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../model/User");
const authMiddleware = expressAsyncHandler(async (req, res, next) => {
	let token;
	if (req?.headers?.authorization?.startsWith("Bearer")) {
		token = req.headers.authorization.split(" ")[1];
		try {
			if (token) {
				//verify  jwt token from client with jwt  secret key
				const decoded = jwt.verify(token, process.env.JWT_KEY);
				// find the user by id
				const user = await User.findById(decoded?.id).select("-password")
				//attach the user to the req object
				req.user = user
				next()
			}
		} catch (error) {
			throw new Error("Not Authorized- token expired, login again")
		}
	} else {
		throw new Error("There is no token Attached to the header")
	}
})
module.exports = authMiddleware;