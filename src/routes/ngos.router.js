const express = require("express");
const router = express.Router();
const Ngo = require("../models/Ngo.model");
const emailRegex = require("../consts");

router.get("/", async (_, res, next) => {
  try {
    const ngos = await Ngo.find();
    res.json(ngos);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const ngo = await Ngo.findById(id);
    if (!ngo) {
      handleNotFound(res);
      return;
    }
    res.json(ngo);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
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

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const newNgo = new Ngo({
      email,
      password,
      name,
      description,
      identification,
      donationLink,
      verifiedDate,
      image,
    });

    const savedNgo = await newNgo.save();
    res.status(201).json(savedNgo);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const {
    email,
    name,
    description,
    identification,
    donationLink,
    verifiedDate,
    image,
  } = req.body;

  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const updatedNgo = await Ngo.findByIdAndUpdate(
      id,
      {
        email,
        name,
        description,
        identification,
        donationLink,
        verifiedDate,
        image,
      },
      { new: true, runValidators: true }
    );

    if (!updatedNgo) {
      handleNotFound(res);
      return;
    }

    res.json(updatedNgo);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    await Ngo.findByIdAndDelete(id);

    res.json({ message: "NGO deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
