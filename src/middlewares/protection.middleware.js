const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization.model");
const { TOKEN_SECRET } = require("../../consts");
const User = require("../models/User.model");

async function protectionMiddleware(req, res, next) {
  try {
    // token is sent in the headers as `Bearer <token>`
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Missing Bearer Token" });
      return;
    }

    // verifies the token and returns the payload
    const { email } = jwt.verify(token, TOKEN_SECRET);

    const accountType = req.headers.authorization?.split(" ")[2];

    const accountModels = { user: User, organization: Organization };

    const validAccountTypes = Object.keys(accountModels);

    console.log(req.headers, "headers", accountType, "accountType");
    if (!validAccountTypes.includes(accountType)) {
      return res.status(400).json({});
    }

    const user = await accountModels[accountType].findOne(
      { email: email },
      { password: 0 }
    );
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }
    console.log(user);
    // store the found user in the request object, so it's available in the next middleware
    req.user = user;
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
