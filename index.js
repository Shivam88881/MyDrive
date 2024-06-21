const app = require('./app');
const dotenv = require("dotenv");
const connectMongoDatabase = require("./config/database");


//Handeling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

//config
dotenv.config({path:"./config/config.env"});


// Connecting to MongoDB
connectMongoDatabase();



const server = app.listen(process.env.PORT,()=>{
    console.log("server is running on port ",process.env.PORT)
});

//Unhandeled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1); 
    })
})