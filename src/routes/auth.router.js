const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { TOKEN_SECRET, passwordRegex, emailRegex } = require("../../consts");
const User = require("../models/User.model");
const Organization = require("../models/Organization.model");

router.post("/users/signup", async (req, res, next) => {
  const { email, password, name } = req.body;

  // if (!passwordRegex.test(password)) {
  //   return res.status(400).json({
  //     message:
  //       "Password must be at least 8 characters long, contain at least one number, and one special character (!, @, #, $, %, etc).",
  //   });
  // }

  // if (!emailRegex.test(email)) {
  //   return res.status(400).json({ message: "Invalid email format." });
  // }

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

router.post("/organizations/signup", async (req, res, next) => {
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

  // if (!passwordRegex.test(password)) {
  //   return res.status(400).json({
  //     message:
  //       "Password must be at least 8 characters long, contain at least one number, and one special character (!, @, #, $, %, etc).",
  //   });
  // }

  // if (!emailRegex.test(email)) {
  //   return res.status(400).json({ message: "Invalid email format." });
  // }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const createdOrganization = await Organization.create({
      email,
      password: hashedPassword,
      name,
      description,
      identification,
      donationLink,
      verifiedDate,
      image,
    });

    delete createdOrganization._doc.password;

    res.status(201).json(createdOrganization);
  } catch (err) {
    next(err);
  }
});

// /login?accountType=organization accountType récupéré dans le req.query

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const { accountType } = req.query;

  const accountModels = { user: User, organization: Organization };

  const validAccountTypes = Object.keys(accountModels);

  if (!validAccountTypes.includes(accountType)) {
    return res.status(400).json({});
  }

  try {
    const account = await accountModels[accountType]
      .findOne({ email })
      .select("+password");
    const isOrganization = accountType === "organization";

    const isCorrectCredentials =
      account != null && (await bcrypt.compare(password, account.password));

    if (!isCorrectCredentials) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const authToken = jwt.sign({ email, isOrganization }, TOKEN_SECRET, {
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
