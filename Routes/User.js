import express from "express";
import bcrypt from "bcrypt";
import { User, decodeJwtToken, generateJwtToken } from "../Models/User.js";

let router = express.Router();

//SignUp
router.post("/signup", async (req, res) => {
  try {
    // Check User is already available
    
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).json({ message: "Email already registered" });

    //generate hashed password
    let Salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password, Salt);

    //Adding new user to DB
    let newuser = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    }).save();

    //generate Jwt Token
    let token = generateJwtToken(newuser._id);
    res.status(200).json({ message: "SignUp successfully", token });
  } catch (error) {
    console.log("Error in Signup", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//LogIn
router.post("/login", async (req, res) => {
  try {
    // Check User is available
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    //validate password
    let validateassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validateassword)
      return res.status(400).json({ message: "Invalid Credentials" });

    //generate Jwt Token
    let token = generateJwtToken(user._id);
    res.status(200).json({ message: "Login successfully", token });
  } catch (error) {
    console.log("Error in Login", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get User Data by Token
router.get("/get-user-data", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });

    res.status(200).json({ message: "User Data Got Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


//Add Data
router.put("/add-data", async (req, res) => {
    try {
        let token = req.headers["x-auth"];
        let userId = decodeJwtToken(token);
        let user = await User.findById({ _id: userId });
      if (!user) return res.status(400).json({ message: "Invalid Authorization" });
      
      let data={name:req.body.name,descrp:req.body.descrp,start:req.body.start,end:req.body.end}
      let connections=[...user.connections,data]
  
      let updateData = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { connections: connections } },
      );

      res.status(200).json({ message: "Data Added Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

export let userRouter = router;