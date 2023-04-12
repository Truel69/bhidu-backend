require('dotenv').config();
const mongoose = require("mongoose");
const URL = process.env.MONGODB_URL;
console.log(URL)

const dbConnect = () => {

  const connectionParams = {useNewUrlParser:true,
                            useUnifiedTopology: true,
                            dbName: "bhidu"};

  mongoose.connect(URL, connectionParams);

  mongoose.connection.on("connected", () => {
    console.log("connected to database sucessfully")
  })

  mongoose.connection.on("error", (err) => {
    console.log("Error occured while connecting" + err)
  })

  mongoose.connection.on("disconnected", (err) => {
    console.log("Database disconnected")
  })

};

module.exports = dbConnect;