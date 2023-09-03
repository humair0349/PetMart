const app = require("./App");
const dotenv = require('dotenv');
const connectDatabase = require('./Config/database');

// Handled Uncaught Exception
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
});

// Config (loads the environment variables)
dotenv.config({ path: "Backend/Config/Config.env" });

// Server is Running
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is Running on http:192.168.156.160/${process.env.PORT}}`);
});

// Connecting to Database
connectDatabase();

// Unhandled Pormise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");

    server.close(() => {
        process.exit(1);
    });
});