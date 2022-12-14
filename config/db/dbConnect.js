const mongoose = require('mongoose');
const dbConnect=async ()=>{ 
	try {
		// set up a connection with the database.
		await mongoose.connect(process.env.MONGODB_URI_ATLAS, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
		console.log('Db is connected Successfully');
	} catch (error) {
        console.log(`Error ${error.message}`);  
    }
}
module.exports = dbConnect;