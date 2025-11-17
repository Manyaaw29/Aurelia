const express = require("express");
const router = express.Router();

const authCtrl = require("../controllers/authController");
const { redirectIfAuth, requireAuth } = require("../middleware/auth");

// Signup
router.get("/signup", redirectIfAuth, authCtrl.getSignup);
router.post("/signup", authCtrl.postSignup);

// Signin
router.get("/signin", redirectIfAuth, authCtrl.getSignin);
router.post("/signin", authCtrl.postSignin);

// Signout
router.post("/signout", authCtrl.postSignout);

// Profile Page
router.get("/profile", requireAuth, authCtrl.getProfile);

module.exports = router;
