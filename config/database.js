const mongoose = require("mongoose");


const connectMongoDatabase = () => {
  // console.log(process.env.MONGO_DB_URI);
  mongoose
    .connect(process.env.MONGO_DB_URI, {
      maxPoolSize:500,
      minPoolSize:100,
      autoIndex: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectMongoDatabase;