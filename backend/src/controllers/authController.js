const bcrypt = require("bcrypt");
const User = require("../models/User");

// Render signup page
exports.getSignup = (req, res) => {
  res.render("pages/signup");
};

// Create account
exports.postSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).send("Missing fields");

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send("Email already exists");

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash: hash
    });

    req.session.userId = user._id;
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

// Render signin page
exports.getSignin = (req, res) => {
  res.render("pages/signin");
};

// Login
exports.postSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).send("Invalid email or password");

    req.session.userId = user._id;
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

// Logout
exports.postSignout = (req, res) => {
  req.session.destroy(() => res.redirect("/"));
};

// Render account page
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.session.userId)
    .populate("wishlist")
    .populate("cart.product");

  res.render("pages/account", { user });
};
