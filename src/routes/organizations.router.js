const express = require("express");
const router = express.Router();
const Organization = require("../models/Organization.model");
const emailRegex = require("../../consts");
const { handleNotFound } = require("../../utils");
const protectionMiddleware = require("../middlewares/protection.middleware");

router.get("/", async (_, res, next) => {
  try {
    const organizations = await Organization.find().select("-password");
    res.json(organizations);
  } catch (err) {
    next(err);
  }
});

router.use(protectionMiddleware);

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findById(id).select("-password");
    if (!organization) {
      handleNotFound(res);
      return;
    }
    res.json(organization);
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

  // if (email && !emailRegex.test(email)) {
  //   return res.status(400).json({ message: "Invalid email format." });
  // }

  try {
    let updatedOrganization = await Organization.findByIdAndUpdate(
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
    ).select("-password");

    if (!updatedOrganization) {
      handleNotFound(res);
      return;
    }

    res.json(updatedOrganization);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    await Organization.findByIdAndDelete(id);

    res.json({ message: "NGO deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
