const mongoose = require('mongoose')
// check weather the mongoId is valid or not
const validateMongodbId = id => {
	const isValid = mongoose.Types.ObjectId.isValid(id);
	if(!isValid) throw new Error("The id is not valid or Not found")
}

module.exports = validateMongodbId;