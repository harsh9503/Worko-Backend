const User = require("../models/User")

//-----------------------------------------------------------------------------------
exports.updateUser = async (req, res) => {
    try {
        const {
            email,
            name,
            age,
            city,
            zipcode,
        } = req.body;

        const id = req.user.id;
        console.log(req.body);

        // Find the profile by id
        const userDetails = await User.findById(id);
  
        const updateFields = {};
        if (email) updateFields.email = email;
        if (name) updateFields.name = name;
        if (age) updateFields.age = age;
        if (city) updateFields.city = city;
        if (zipcode) updateFields.zipcode = zipcode;

        const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
            new: true,
        });

        await updatedUser.save();

        // Find the updated user details
        const updatedUserDetails = await User.findById(id)

        return res.json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
  };
  

  //--------------------------------------------------------------------------------------

  exports.deleteUser = async (req, res) => {
    try {
      const id = req.user.id

      const user = await User.findById({ _id: id })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }
    
      await User.findByIdAndDelete({ _id: id })
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      })
 
    } catch (error) {
      console.log(error)
      res
        .status(500)
        .json({ success: false, 
            message: "User Cannot be deleted successfully" 
        })
    }
  }
  
//-----------------------------------------------------------------------------------------

exports.getUser = async (req, res) => {
    try {
      const id = req.user.id
      const userDetails = await User.findById(id)

      res.status(200).json({
        success: true,
        message: "User Data fetched successfully",
        data: userDetails,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  //---------------------------------------------------------------------------------------

  exports.getAlluser = async (req, res) => {
    try {
      const id = req.user.id
      const userData = await User.find(id)

      res.status(200).json({
        success: true,
        message: "User Data fetched successfully",
        data: userData,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }


