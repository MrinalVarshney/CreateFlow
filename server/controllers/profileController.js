const User = require("../models/userSchema");

const ProfileUpdate = async (req, res) => {
  const { user, data, modalContent } = req.body;
  console.log("modalContent", modalContent, data);

  let updateField;
  switch (modalContent) {
    case "username":
      updateField = { username: data };
      break;
    case "bio":
      updateField = { bio: data };
      break;
    case "email":
      updateField = { email: data };
      break;
    case "pic":
      updateField = { pic: data };
      break;
    default:
      updateField = {};
  }

  try {
    const response = await User.findByIdAndUpdate(user._id, updateField, {
      new: true, // This option returns the modified document rather than the original one
    });

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = ProfileUpdate;
