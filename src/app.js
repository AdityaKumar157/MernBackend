const express = require("express");
const path = require("path");
require("./db/conn");
const hbs = require("hbs");
const Employee = require("./models/Employee");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const PORT = process.env.PORT || 7000;
const staticPath = path.join(__dirname,"../public");
const viewsPath = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.static(staticPath))
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.get("/", (req,res) => {
    res.render("index");
});

app.get("/profile", auth, (req,res) => {
    //console.log(`Cookie saved to browser is: ${req.cookies.jwt}`);
    res.render("profile", {
        details: `FirstName is ${req.user.firstname}. LastName is ${req.user.lastname}.`
    });
});

app.get("/login", (req,res) => {
    res.render("login");
});

app.post("/login", async(req,res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        //console.log(`${email} and ${password}`);
        const result = await Employee.findOne({email:email});
        if(result) {
            const isPassMatch = await bcrypt.compare(password,result.password);
            const token = await result.generateAuthToken();
            if(isPassMatch) {
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 600000),
                    httpOnly: true,
                    secure: true
                });

                res.status(201).render("index");
            }else{
                res.status(400).send("Invalid email or password");
            } 
        }else {
            res.status(400).send("Invalid email or password");
        }
    }catch(err) {
        console.log(err);
        res.status(400).send("Invalid email or password");
    }
});

app.get("/logout", auth, async(req,res) => {
    try {
        //logout from single device
        // req.user.tokens = req.user.tokens.filter((currElement) => {
        //     return currElement.token != req.token;
        // });

        //logout from all devices
        req.user.tokens = [];

        res.clearCookie("jwt");
        console.log("Logout Successfully");
        await req.user.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/register", (req,res) => {
    res.render("register");
});

app.post("/register", async(req,res) => {
    try{
        console.log(req.body.firstName);
        const password = req.body.password;
        const confirmPassword = req.body.confirmpassword;
        if(password==confirmPassword) {
            const employee = new Employee({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: confirmPassword,
            });

            const token = await employee.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            });
            console.log(cookie);

            const result = await employee.save();
            res.status(201).render("index");
        }else{
            res.send("Passwords are not matching");
        }
    }catch(err) {
        console.log(err);
        res.status(400).send(err);
    }
});

app.get("/*", (req,res) => {
    res.render("error404");
});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

//Hashing
// const securePassword = async(password) => {
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     const isPasswordEqual = await bcrypt.compare("password@123456", passwordHash);
//     console.log(isPasswordEqual);
// }

// securePassword("password@123456");

//Token Creation
const createToken = async() => {
    const token = await jwt.sign({_id:"64a141d6507261a0f5997cf8"}, "7Ca/xcP1rh8Ljaih3JZItZOGjqWWZlfU3S7tbpNt6Os=", {
        expiresIn:"2 seconds"
    });
    console.log(token);
    const userVer = await jwt.verify(token, "7Ca/xcP1rh8Ljaih3JZItZOGjqWWZlfU3S7tbpNt6Os=");
    console.log(userVer);
}

//createToken();