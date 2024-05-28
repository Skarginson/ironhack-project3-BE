const express = require("express");
const router = express.Router();
const Mission = require("../models/Mission.model");

router.get("/", async (_, res, next) => {
  try {
    const missions = await Mission.find().populate("organization");
    res.json(missions);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const mission = await Mission.findById(id).populate("organization");
    if (!mission) {
      handleNotFound(res);
      return;
    }
    res.json(mission);
  } catch (err) {
    next(err);
  }
});

router.get("/organization/:organizationId", async (req, res, next) => {
  const { organizationId } = req.params;

  try {
    const missions = await Mission.find({
      organization: organizationId,
    }).populate("organization");
    res.json(missions);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const { name, startDate, endDate, description, organization } = req.body;

  try {
    const newMission = new Mission({
      name,
      startDate,
      endDate,
      description,
      organization,
    });

    const savedMission = await newMission.save();
    res.status(201).json(savedMission);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, startDate, endDate, description, organization } = req.body;

  try {
    const updatedMission = await Mission.findByIdAndUpdate(
      id,
      { name, startDate, endDate, description, organization },
      { new: true, runValidators: true }
    ).populate("organization");

    if (!updatedMission) {
      handleNotFound(res);
      return;
    }

    res.json(updatedMission);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedMission = await Mission.findByIdAndDelete(id);

    if (!deletedMission) {
      handleNotFound(res);
      return;
    }

    res.json({ message: "Mission deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
