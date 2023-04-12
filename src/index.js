const express = require('express');
const cookieParser = require("cookie-parser")
const dbConnect = require("./dbconnect")
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 3000
// const session = require('express-session'); 
// const user = require("./models/users");
// const userRoutes = require("./routes/userRoutes");
// const truckRoutes = require("./routes/truckRoutes");


const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(express.json()); 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Testing with barebones frontend
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));


// app.use("/",userRoutes);
// app.use("/stundet",userRoutes);
// app.use("/faculty",truckRoutes);
// app.use("/admin",truckRoutes);

app.listen(PORT,async (err)=>{
    if(err) console.log(err)
    await dbConnect()
    await console.log(`Server is running on http://localhost:${PORT}`)
});