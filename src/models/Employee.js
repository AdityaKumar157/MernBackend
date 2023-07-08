require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    confirmpassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

employeeSchema.methods.generateAuthToken = async function() {
    try{
        //console.log(`Key: ${process.env.SECRET_KEY}`);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        console.log(token);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(err) {
        res.send(err);
        console.log(err);
    }
}

employeeSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        console.log(`Password before hasing is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
        console.log(`Password after hasing is ${this.password}`);
    }
    next();
});

const Employee = new mongoose.model("Employee", employeeSchema);

module.exports = Employee;