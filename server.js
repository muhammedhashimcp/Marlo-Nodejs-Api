const express = require('express');
// import and invoke the dotenv 
const dotenv = require('dotenv').config();
// db import
const dbConnect = require('./config/db/dbConnect');



//middleware  imports
// const cors = require('cors');
const morgan = require('morgan');

//Route imports
const userRoutes = require('./route/usersRoute');

// middleware
const app = express();
app.use(express.json());
// app.use(cors());

// Creates a connection to a MongoDB instance
dbConnect();

// application level middleware for debugging
app.use(morgan('dev'));

// Error handling custom middleware 
const { errorHandler, notFound } = require('./middleWares/error/errorHandler');


// verify the server ready by using default endpoint if necessary;
app.get('/', (req, res) => {
	res.send('REST APIs  FOR MARLO');
});

// user router
app.use('/api/users', userRoutes);


//Error Handler
app.use(notFound);
app.use(errorHandler);

// Port for server
const PORT = process.env.PORT || 5000;

// initialize the nodejs server 
app.listen(PORT, console.log(`Server is Running at ----PORT ${PORT}`));
