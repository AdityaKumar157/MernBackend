const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const auth = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        
        const user = await Employee.findOne({_id:verifyUser._id});
        console.log(user);

        //return user;
        req.user = user;
        req.token = token;
        next();
    }catch(err) {
        res.status(401).send(err);
    }
}


module.exports = auth;