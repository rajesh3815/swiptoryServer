const user = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).send("All fields are require");
  }
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new user({
      name,
      password: encryptedPassword,
    });
    await newUser.save();
    res.send("user Created Successfully");
  } catch (error) {
    res.status(400).send("Error in user Registration");
    console.log("error from userRegistration:)", error);
  }
};

const loginUser = async (req, res) => {
  const { name, password } = req.body;
  const isUserExist = await user.findOne({ name });
  if (!isUserExist) {
    return res.status(500).send({
      message: "user doesnot exist!",
      status: 500,
    });
  }
  try {
    const decryptPassword = await bcrypt.compare(
      password,
      isUserExist.password
    );
    if (!decryptPassword) {
      return res.status(500).send({
        message: "password error",
        status: 400,
      });
    } else {
      const token = jwt.sign(
        { userId: isUserExist._id },
        process.env.SECRET_KEY
      );
      return res.send({
        name,
        status:200,
        message: "successfully loged-in",
        token,
        userId:isUserExist._id 
      });
    }
  } catch (error) {
    res.status(400).send({
      message: "Error in login",
      status:300,
    });
    console.log("Error from userLogin:)",error);
  }
};

module.exports = { registerUser, loginUser };
