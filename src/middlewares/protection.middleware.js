const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization.model");
const { TOKEN_SECRET } = require("../../consts");
const User = require("../models/User.model");

async function protectionMiddleware(req, res, next) {
  try {
    // token is sent in the headers as `Bearer <token> <accountType>`
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Missing Bearer Token" });
      return;
    }

    // verifies the token and returns the payload
    const { email } = jwt.verify(token, TOKEN_SECRET);

    const accountType = req.headers.authorization?.split(" ")[2];

    let user;

    if (accountType === "organization") {
      user = await Organization.findOne({ email: email }, { password: 0 });
    } else if (accountType === "user") {
      user = await User.findOne({ email: email }, { password: 0 }).populate({
        path: "organizations.organization",
        select: "name _id email",
      });
    } else {
      res.status(400).json({ message: "Invalid account type" });
      return;
    }

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    // store the found user in the request object, so it's available in the next middleware
    req.user = user;
    req.accountType = accountType;
    next();
  } catch (err) {
    if (err.name.includes("Token")) {
      res.status(401).json({ message: "Invalid Token" });
    } else {
      next(err);
    }
  }
}

module.exports = protectionMiddleware;
