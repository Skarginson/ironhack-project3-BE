const express = require("express");
const router = express.Router();

const protectionMiddleware = require("../middlewares/protection.middleware");

router.use(protectionMiddleware); // 👇 all routes bellow are now protected

router.get("/me", (req, res) => {
  // `user` was stored in `req` in the `protectionMiddleware`
  res.json(req.user);
});

module.exports = router;
