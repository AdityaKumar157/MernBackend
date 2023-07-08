require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connection to database successfull!");
}).catch((err) => {
    console.log(`Failed to connect to database with following error: ${err}`);
});