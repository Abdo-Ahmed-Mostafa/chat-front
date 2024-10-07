const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const userNameCheck = await User.findOne({ username });
  if (userNameCheck) {
    return res.json({ msg: "Username already used", status: false });
  }
  const emailCheck = await User.findOne({ email });
  if (emailCheck) {
    return res.json({ msg: "Email already used", status: false });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    username,
    password: hashedPassword,
  });
  delete user.password;
  return res.json({ status: true, user });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.json({ msg: "incorrect username or password", status: false });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.json({ msg: "incorrect username or password", status: false });
  }
  delete user.password;
  delete user._v;
  return res.json({ status: true, user });
};
const setAvatar = async (req, res, next) => {
  const userId = req.params.id;
  const avatarImage = req.body.image;
  const userData = await User.findByIdAndUpdate(userId, {
    isAvatarImageSet: true,
    avatarImage,
  });
  return res.json({
    isSet: userData.isAvatarImageSet,
    image: userData.avatarImage,
  });
};
const getAllUsers = async (req, res, next) => {
  const users = await User.find({ _id: { $ne: req.params.id } }).select([
    "email",
    "username",
    "avatarImage",
    "_id",
  ]);
  return res.json(users);
};
module.exports = {
  register,
  login,
  setAvatar,
  getAllUsers,
};
