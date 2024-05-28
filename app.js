const express = require("express");
const path = require("path");
const logger = require("morgan");

const { PORT } = require("./consts");
// const indexRouter = require("./routes/index.router");
// const usersRouter = require("./routes/users.router");
// const journalsRouter = require("./routes/journals.router");
// const { catchAll, errorHandler } = require("./error-handling");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);
// app.use("/journals", journalsRouter);

// app.use(catchAll);
// app.use(errorHandler);

require("./src/db")();

app.listen(PORT, () => {
  console.log("Server is listening...");
});

// // ℹ️ Gets access to environment variables/settings
// // https://www.npmjs.com/package/dotenv
// require("dotenv").config();

// // ℹ️ Connects to the database
// require("./db");

// // Handles http requests (express is node js framework)
// // https://www.npmjs.com/package/express
// const express = require("express");

// const app = express();

// // ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
// require("./config")(app);

// // 👇 Start handling routes here
// const indexRoutes = require("./routes/index.routes");
// app.use("/api", indexRoutes);

// // ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
// require("./error-handling")(app);

// module.exports = app;
