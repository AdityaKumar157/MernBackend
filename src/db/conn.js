const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/employeeRegistration", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connection to database successfull!");
}).catch((err) => {
    console.log(`Failed to connect to database with following error: ${err}`);
});