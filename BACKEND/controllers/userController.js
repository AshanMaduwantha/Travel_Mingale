import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const { userID } = req.body;

    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        birthday: user.birthday,
        gender: user.gender,
        address: user.address,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userID } = req.body;
    const allowedFields = ['name', 'phone', 'birthday', 'gender', 'address'];
    const updateFields = {};

    allowedFields.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    const updatedUser = await userModel.findByIdAndUpdate(
      userID,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User profile updated successfully',
      userData: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        birthday: updatedUser.birthday,
        gender: updatedUser.gender,
        address: updatedUser.address,
        isAccountVerified: updatedUser.isAccountVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

  

  // Function to delete user
export const deleteUser = async (req, res) => {
    try {
        const { userID } = req.body; // User ID should be provided in the request body

        const user = await userModel.findByIdAndDelete(userID);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find(); // fetch all users
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
