const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const dotenv = require('dotenv');


// Config (loads the environment variables)
dotenv.config({ path: "Backend/Config/Config.env" });


// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Route Import
const product = require('./Routes/ProductRoute');
const user = require('./Routes/UserRoute');
const ordr = require('./Routes/OrderRoute');
const payment = require('./Routes/paymentRoute');

// Middlewares for handle requests
app.use('/api', product);
app.use('/api', user);
app.use('/api', ordr);
app.use('/api', payment);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;