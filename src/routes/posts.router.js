const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");

router.get("/posts", async (req, res, next) => {
  try {
    const posts = await Post.find().populate("organization mission");
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// router.use(protectionMiddleware);

router.get("/posts/:id", async (req, res, next) => {
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

router.get("/missions/:missionId/posts", async (req, res, next) => {
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

router.get("/organizations/:organizationId/posts", async (req, res, next) => {
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

router.post("/posts", async (req, res, next) => {
  const { title, content, image, organization, mission } = req.body;

  try {
    const newPost = {
      title,
      content,
      image,
      organization,
      mission,
    };

    const createdPost = await Post.create(newPost);
    res.status(201).json(createdPost);
  } catch (err) {
    next(err);
  }
});

router.put("/posts/:id", async (req, res, next) => {
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

router.delete("/posts/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    await Post.findByIdAndDelete(id);

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
