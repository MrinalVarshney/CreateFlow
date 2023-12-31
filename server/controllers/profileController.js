const User = require("../models/userSchema");

const ProfileUpdate = async (req, res) => {
  const { user, data, modalContent } = req.body;
  console.log("modalContent", modalContent,data);
  try {

    await User.findByIdAndUpdate(user._id, {modalContent:data});
    res.status(200).json({ success: true, message: "updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internet server error" });
  }
};

module.exports = ProfileUpdate;
