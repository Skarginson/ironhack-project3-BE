const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");

const { PORT } = require("./consts");
const usersRouter = require("./src/routes/users.router");
const authRouter = require("./src/routes/auth.router");
const missionsRouter = require("./src/routes/missions.router");
const organizationsRouter = require("./src/routes/organizations.router");
const postsRouter = require("./src/routes/posts.router");

const { catchAll, errorHandler } = require("./src/error-handling");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/organizations", organizationsRouter);
app.use("/", missionsRouter);
app.use("/", postsRouter);

app.use(catchAll);
app.use(errorHandler);

require("./src/db")();

app.listen(PORT, () => {
  console.log("Server is listening...");
});
