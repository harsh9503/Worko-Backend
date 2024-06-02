const User = require("../models/User")

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

//--------------------------------------------------------------------------
exports.signup = async (req, res) => {
    try {
      // Destructure fields from the request body
      const {
        email,
        name,
        age,
        city,
        zipcode,
        password,
        confirmPassword,
        accountType,
      } = req.body

      // Check if All Details are there or not
      if (
        !email ||!name ||!age ||!password ||!confirmPassword ||!city || !zipcode ||!accountType) {
        return res.status(403).send({
          success: false,
          message: "All Fields are required",
        })
      }

      // Check if password and confirm password match
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message:
            "Password and Confirm Password do not match. Please try again.",
        })
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists. Please sign in to continue.",
        })
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10)
  
      const user = await User.create({
        email,
        name,
        age,
        city,
        zipcode,
        password: hashedPassword,
        accountType: accountType,
      })
  
      return res.status(200).json({
        success: true,
        user,
        message: "User registered successfully",
      })
    } 
    catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "User not registered. Please try again.",
      })
    }
  }

//-------------------------------------------------------------------------

// Login controller
exports.login = async (req, res) => {
    try {
      // Get email and password from request body
      const { email, password } = req.body
  
      // Check if email or password is missing
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: `Please Fill up All the Required Fields`,
        })
      }
  
      // Find user with provided email
      const user = await User.findOne({ email })
  
      // If user not found with provided email
      if (!user) {
        return res.status(401).json({
          success: false,
          message: `User is not Registered, Please SignUp to Continue`,
        })
      }
  
      // Generate JWT token and Compare Password
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { 
            email: user.email, 
            id: user._id, 
            role: user.role 
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        )
  
        // Save token to user document in database
        user.token = token
        user.password = undefined
  
        // Set cookie for token and return success response
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        }
  
        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: `User Login Success`,
        })
      } 
      else {
        return res.status(401).json({
          success: false,
          message: `Password is incorrect`,
        })
      }
    } 
    catch (error) {
      console.error(error)
      // Return 500 Internal Server Error status code with error message
      return res.status(500).json({
        success: false,
        message: `Login Failure Please Try Again`,
      })
    }
  }
//-----------------------------------------------------------------------------------  
exports.logout = (req, res) => {
    try {
        // Clear the token from the user object
        req.user.token = undefined;
  
        // Clear the token cookie
        res.clearCookie("token");
  
        // Respond with a success message
        return res.json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Logout failure, please try again",
        });
    }
  };