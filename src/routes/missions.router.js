const express = require("express");
const router = express.Router();
const Mission = require("../models/Mission.model");
const handleNotFound = require("../../utils");
const protectionMiddleware = require("../middlewares/protection.middleware");

router.get("/missions", async (_, res, next) => {
  try {
    const missions = await Mission.find().populate("organization");
    res.json(missions);
  } catch (err) {
    next(err);
  }
});

router.use(protectionMiddleware);

router.get("/missions/:id", async (req, res, next) => {
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

router.get(
  "/organizations/:organizationId/missions",
  async (req, res, next) => {
    const { organizationId } = req.params;

    try {
      const missions = await Mission.find({
        organization: organizationId,
      }).populate("organization");
      res.json(missions);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/missions", async (req, res, next) => {
  const { name, startDate, endDate, description } = req.body;

  if (req.accountType !== "organization") {
    res.status(403).json({ message: "Only organization can create missions" });
    return;
  }

  const orgId = req.user.id;

  try {
    const newMission = {
      name,
      startDate,
      endDate,
      description,
      organization: orgId,
    };

    const createdMission = await Mission.create(newMission);
    res.status(201).json(createdMission);
  } catch (err) {
    next(err);
  }
});

router.put("/missions/:id", async (req, res, next) => {
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

router.delete("/missions/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedMission = await Mission.findOneAndDelete(id); // checker dans le cours.

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
