const userRouter = require("express").Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const Users = require('../models/users');
const Comment = require("../models/comment");
const Questions = require("../models/questions");
const Answers = require("../models/answers");
const axios = require("axios");
const { Query } = require("mongoose");

// Create a user and store in database
userRouter.post("/register", async (req, res) => {
  // try {
  //   const salt = await bcrypt.genSalt(10);
  //   const passwordHash = await bcrypt.hash(req.body.password, salt);

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(req.body.email)) {
  //     res.status(400).json({ error: "Invalid email format" });
  //     return;
  //   }
  //   // The typed password should not contain the username or email.
  //   if (
  //     req.body.password.includes(req.body.username) ||
  //     req.body.password.includes(req.body.email)
  //   ) {
  //     res
  //       .status(400)
  //       .json({ error: "Password should not contain username or email" });
  //     return;
  //   }
  //   const newUser = new Users({
  //     username: req.body.username,
  //     email: req.body.email,
  //     passwordHash: passwordHash,
  //   });
  //   const savedUser = await newUser.save();
  //   console.log(savedUser);
  //   res.status(200).json(savedUser);
  // } catch (error) {
  //   console.error(error);
  //   if (error.keyValue?.email) {
  //     res.status(400).json({ error: "Email already exists" });
  //     return;
  //   }
  //   res.status(500).json({ error: "Internal server error", message: error });
  // }
  try {
    // Validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Ensure password does not contain username or email
    if (req.body.password.includes(req.body.username) || req.body.password.includes(req.body.email)) {
        return res.status(400).json({ error: "Password should not contain username or email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    // Create and save the new user
    const newUser = new Users({
        username: req.body.username,
        email: req.body.email,
        passwordHash: passwordHash,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
} catch (error) {
    console.error(error);
    if (error.keyValue?.email) {
        return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal server error", message: error });
}
});

// Login  user
userRouter.post("/login", async (req, res) => {
  // const email = req.body.email;
  // const password = req.body.password;
  // const user = (await Users.find({ email: email }))[0];
  // console.log("User: ", user);
  // let verdict;
  // if (user) {
  //   verdict = await bcrypt.compare(password, user.passwordHash);
  //   console.log("Verdict: ", verdict);
  // }
  // if (user && verdict) {
  //   req.session.user = user;
  //   res.status(200).json({ user: user });
  // } else {
  //   res.status(401).json({ error: "Invalid credentials" });
  // }
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (user && await bcrypt.compare(password, user.passwordHash)) {
        req.session.user = user;
        res.status(200).json({ user });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", message: error });
}
});

userRouter.post("/logout", async (req, res) => {
  // if (!req.session.user) {
  //   res.status(400).json({ error: "Not logged in" });
  //   return;
  // }
  // req.session.destroy();
  // res.status(200).json({ message: "Logged out" });
  if (!req.session.user) {
    return res.status(400).json({ error: "Not logged in" });
}
req.session.destroy();
res.status(200).json({ message: "Logged out" });
});

// Get users from database if admin.
userRouter.get("/", async (req, res) => {
  // try {
  //   // If user is not admin, return error
  //   if (req.session.user?.admin !== true) {
  //     res.status(401).json({ error: "Unauthorized" });
  //     return;
  //   }
  //   const users = await Users.find({});
  //   res.status(200).json(users);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: "Internal server error", message: error });
  // }
  if (!req.session.user?.admin) {
    return res.status(401).json({ error: "Unauthorized" });
}
try {
    const users = await Users.find({});
    res.status(200).json(users);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", message: error });
}
});


userRouter.patch("/", async (req, res) => {
  // Update a user
});

// Delete a user
userRouter.delete("/", async (req, res) => {
  // try{
  //   if (req.session.user?.admin !== true) {
  //     res.status(401).json({ error: "Unauthorized" });
  //     return;
  //   }
  //   const deleted = await Users.deleteOne({ _id: req.session.user._id });
  //   res.status(200).json(deleted);
  // } catch (error){
  //   console.error(error);
  //   res.status(500).json({ error: "Internal server error", message: error });
  // }
  if (!req.session.user?.admin) {
    return res.status(401).json({ error: "Unauthorized" });
}
try {
    const deleted = await Users.deleteOne({ _id: req.session.user._id });
    res.status(200).json(deleted);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", message: error });
}
});

module.exports = userRouter;
