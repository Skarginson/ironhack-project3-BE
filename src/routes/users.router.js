const express = require("express");
const router = express.Router();
const { emailRegex } = require("../../consts");
const User = require("../models/User.model");

const handleNotFound = require("../../utils");
const protectionMiddleware = require("../middlewares/protection.middleware");

// Que protéger et ne pas protéger ? J'ai envie de tout protéger moi wtf

// router.use(protectionMiddleware); // 👇 all routes bellow are now protected

router.get("/", async (_, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("organizations");
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/me", protectionMiddleware, (req, res) => {
  // `user` was stored in `req` in the `protectionMiddleware`
  res.json(req.user);
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .select("-password")
      .populate("organizations");
    if (!user) {
      handleNotFound(res);
      return;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { email, name, organizations } = req.body;

  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id.select("-password"),
      { email, name, organizations },
      { new: true, runValidators: true }
    ).populate("organizations");

    if (!updatedUser) {
      handleNotFound(res);
      return;
    }

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      handleNotFound(res);
      return;
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
