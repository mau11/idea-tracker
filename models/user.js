import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// define the schema for our user model
const userSchema = mongoose.Schema(
  {
    username: String,
    password: String,
  },
  { timestamps: true }
);

// generating a hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
export const User = mongoose.model("User", userSchema);
