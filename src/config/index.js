const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:3000";

// Middleware configuration
module.exports = (app) => {
  app.use(
    cors({
      origin: [FRONTEND_URL],
    })
  );

  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};
