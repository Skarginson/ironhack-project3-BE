const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find().populate("organization mission");
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate("organization mission");
    if (!post) {
      handleNotFound(res);
      return;
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.get("/mission/:missionId", async (req, res, next) => {
  const { missionId } = req.params;

  try {
    const posts = await Post.find({ mission: missionId }).populate(
      "mission organization"
    );
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get("/organization/:organizationId", async (req, res, next) => {
  const { organizationId } = req.params;

  try {
    const posts = await Post.find({ organization: organizationId }).populate(
      "mission organization"
    );
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const { title, content, image, organization, mission } = req.body;

  try {
    const newPost = new Post({
      title,
      content,
      image,
      organization,
      mission,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { title, content, image, organization, mission } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, image, organization, mission },
      { new: true, runValidators: true }
    ).populate("organization mission");

    if (!updatedPost) {
      handleNotFound(res);
      return;
    }

    res.json(updatedPost);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    await Post.findByIdAndDelete(id);

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
