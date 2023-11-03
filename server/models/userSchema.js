const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save',async function(next){
  if(!this.isModified){
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword; // Store the hashed password in the database
    
  } catch (error) {
    next(error);
  }
})

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};


const User = mongoose.model("User", userSchema);

module.exports = User
