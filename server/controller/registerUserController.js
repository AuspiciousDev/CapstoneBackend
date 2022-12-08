const User = require("../model/User");
const Employee = require("../model/Employee");
const Student = require("../model/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../helper/sendMail");
const createToken = require("../helper/createToken");
const registerUserController = {
  createNewUser: async (req, res) => {
    // Retrieve data
    let verifyUserExists;
    var userType;
    const roles = [];
    const { username, email, password } = req.body;
    console.log(req.body);
    // Validate Data if given
    try {
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
      }
      if (password.length < 8)
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters." });

      const duplicateUser = await User.findOne({ username }).lean().exec();
      if (duplicateUser) {
        return res
          .status(409)
          .json({ message: "Username already registered!" });
      }
      const duplicateEmail = await User.findOne({ email }).lean().exec();
      if (duplicateEmail) {
        return res
          .status(409)
          .json({ message: "Username already registered!" });
      }
      verifyUserExists = await Employee.findOne({
        empID: username,
        // email: email,
      })
        .lean()
        .exec();
      console.log("Register12: ", verifyUserExists);
      userType = "employee";
      if (
        !verifyUserExists ||
        verifyUserExists === null ||
        verifyUserExists === undefined
      ) {
        verifyUserExists = await Student.findOne({
          studID: username,
          // email: email,
        })
          .lean()
          .exec();
        console.log("Register2: ", verifyUserExists);
        userType = "student";
        if (
          !verifyUserExists ||
          verifyUserExists === null ||
          verifyUserExists === undefined
        ) {
          return res
            .status(400)
            .json({ message: "User data does not exists!" });
        } else {
          roles.push(2003);
        }
      } else {
        roles.push(parseInt(verifyUserExists.empType));
      }
      console.log("userType :", userType);
      const hashedPassword = await bcrypt.hash(password, 10);
      const userObject = {
        username,
        password: hashedPassword,
        email,
        roles,
        userType,
      };
      const activationToken = createToken.activation(userObject);
      console.log(process.env.BASE_URL);
      const url = `${process.env.BASE_URL}api/auth/activate/${activationToken}`;
      sendMail.sendEmailRegister(
        email,
        url,
        `Verify your email {debug check}`,
        username
      );
      res.status(200).json({ message: "Welcome! Please check your email." });
      console.log("userObject :", userObject);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  },
  activate: async (req, res) => {
    try {
      //get token
      const { activation_token } = req.body;
      console.log(
        "🚀 ~ file: registerUserController.js:90 ~ activate: ~ activation_token",
        activation_token
      );
      console.log("Activation_Token :", activation_token);
      // verify token
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const { username, email, password, roles, userType } = user;
      // check user
      const checkUser = await User.findOne({ username, email });
      console.log(checkUser);
      if (checkUser)
        return (
          res
            .status(400)
            // .json({ message: `${checkUser}` });
            .json({ message: "This username/email is already registered!" })
        );
      //add user to the db
      const newUser = new User({ username, email, password, roles, userType });
      console.log(newUser);
      await newUser.save();
      // activate success
      res.status(200).json({
        message: "Your account has been activated!, You can now sign in!",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  },
};
module.exports = registerUserController;
