const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { TOKEN_SECRET, passwordRegex, emailRegex } = require("../consts");
const User = require("../models/User.model");
const Ngo = require("../models/Ngo.model");

router.post("/signup/user", async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, contain at least one number, and one special character (!, @, #, $, %, etc).",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const createdUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    delete createdUser._doc.password; // Remove password from response

    res.status(201).json(createdUser);
  } catch (err) {
    next(err);
  }
});

router.post("/signup/ngo", async (req, res, next) => {
  const {
    email,
    password,
    name,
    description,
    identification,
    donationLink,
    verifiedDate,
    image,
  } = req.body;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, contain at least one number, and one special character (!, @, #, $, %, etc).",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const createdNgo = await Ngo.create({
      email,
      password: hashedPassword,
      name,
      description,
      identification,
      donationLink,
      verifiedDate,
      image,
    });

    delete createdNgo._doc.password;

    res.status(201).json(createdNgo);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    let isNgo = false;

    if (!user) {
      user = await Ngo.findOne({ email });
      isNgo = true;
    }

    const isCorrectCredentials =
      user != null && (await bcrypt.compare(password, user.password));

    if (!isCorrectCredentials) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const authToken = jwt.sign({ email, isNgo }, TOKEN_SECRET, {
      algorithm: "HS256",
      issuer: "Skarginson",
      expiresIn: "7d",
    });

    res.json({ authToken });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
