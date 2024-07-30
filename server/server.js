import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

import User from "./Schema/User.js";

const server = express();

let PORT = process.env.PORT || 3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());

//connect to mongodb=======================================
mongoose
  .connect(process.env.MONGODB_URL, {
    autoIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const formatDatatoSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return {
    access_token: access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

//is username exists======================================
const generateUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);
  isUsernameUnique ? (username += nanoid().substring(0, 5)) : "";
  return username;
};

//signup================================================
server.post("/signup", (req, res) => {
  let { fullname, email, password } = req.body;

  //data validation
  // if (!fullname || !email || !password) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Please provide all the required fields",
  //   });
  // }
  if (fullname.length < 4) {
    return res
      .status(400)
      .json({ error: "Fullname must be at least 4 characters long" });
  }

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "Please provide a valid email address" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter and one number",
    });
  }
  bcrypt.hash(password, 10, async (err, hash_password) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    let username = await generateUsername(email);
    let user = new User({
      personal_info: {
        fullname,
        email,
        password: hash_password,
        username,
      },
    });

    //save user || database===========================
    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDatatoSend(u));
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res.status(409).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: err.message });
      });
    //console.log(hash_password);
  });

  // return res.status(200).json({ message: "okay request" });
});

//login================================================
server.post("/signin", (req, res) => {
  let { email, password } = req.body;
  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(500).json({ error: "user do not exist" });
      }

      bcrypt.compare(password, user.personal_info.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Eror while login" });
        }
        if (!result) {
          return res
            .status(403)
            .json({ error: "Email or Password(password) do not match" });
        } else {
          return res.status(200).json(formatDatatoSend(user));
        }
      });

      //console.log(user);
      //return res.json({ status: "got user document" });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(403).json({ error: err.message });
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//dac6d560314de6b0b0d6971b0fee5d57de83823a40162755624e3f8864f780dce7e52db6d13116a2a82cbdf36acd9c03c6b1c353587a38e55d7654152f767c85
