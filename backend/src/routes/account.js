const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// View account page
router.get("/", authCtrl.getProfile);

// Update profile details
router.post("/update", async (req, res) => {
  const User = require("../models/User");

  const user = await User.findById(req.session.userId);

  const { firstName, lastName, phone, gender, dob } = req.body;

  user.firstName = firstName;
  user.lastName = lastName;
  user.phone = phone;
  user.gender = gender;
  user.dob = dob;

  await user.save();

  res.redirect("/account");
});

module.exports = router;
