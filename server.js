// //importing all required external modules after installation

// const express=require('express')
// const mongoose=require('mongoose')
// require('dotenv').config()
// const User=require('./models/User')


// //Middleware

// const PORT=3000;
// const app=express()
// app.use(express.json())

// //connecting the atlas databases

// mongoose.connect(process.env.MONGO_URL).then(
//   ()=>console.log("DB Connected Successfully")
// ).catch(
//   (err)=>console.log(err)
// )

// //API landing page http://localhost:3000/

// app.get('/',async(req,res)=>{
//   try{
//     res.send("Welcome to the Backend")
//   }
//   catch(err){
//     console.log(err)
//   }
// })

// //API registration

// app.post('/register',async(req,res)=>{
//   const{user,email,password}=req.body
//   try{
//     const hashPassword=await bcrypt.hash(password,10)
//     const newUser=new User({user,email,password:hashPassword})
//     await newUser.save()
//     console.log("new user is registered successfully")
//     res.json({message:'user created'})
//   }
//   catch(err){
//     console.log(err)
//   }
// })

// //server running and testing 

// app.listen(PORT,(err)=>{
//        if(err){
//         console.log(err);
//      }
//       console.log("server is running on port :",+ PORT)
// })

// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // ✅ Import bcrypt for password hashing
require("dotenv").config();
const User = require("./models/User"); // Ensure this file exists

// Middleware
const PORT = 3000;
const app = express();
app.use(express.json());

// Connecting to MongoDB Atlas
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("DB Connected Successfully"))
.catch((err) => console.log("MongoDB Connection Error:", err));

// API landing page http://localhost:3000/
app.get("/", async (req, res) => {
  try {
    res.send("Welcome to the Backend");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// API for user registration
app.post("/register", async (req, res) => { // ✅ Corrected req, res order
  const { user, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ user, email, password: hashPassword });

    await newUser.save();
    console.log("New user is registered successfully");

    // Send response
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

//API for Login
// app.post('/login',async(req,res)=>{
//   const {email,password}=req.body
//   try{
//       const user=await User.findone({email});
//       if(!user || !(await bcrypt.compare(password,user.password)))
//       {
//         return res.status(400).json({message:"Invalid Credentials"});
//       }
//       res.json({message:"Login Successfull"})
//   }
//   catch(err){
//       console.log(err)
//   }
// })

// API for Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    res.json({ message: "Login Successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Server running and testing
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server is running on port:", PORT);
});
