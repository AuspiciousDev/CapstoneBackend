require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const credentials = require("./middleware/credentials");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 4600;

// Connect to MongoDB
connectDB();

//set the template engine
app.set("view engine", "ejs");

// custom middleware logger
app.use(logger);

// handle options credentials check - before CORS!
// and fetch cookies credentials  requirements
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// app.use(
//   cors({
//     origin: "http://localhost:3600",
//   })
// );

// built-in middleware for json
app.use(express.json());
// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));
// middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.resolve(__dirname, "public")));

// API ROUTES
app.use("/", require("./routes/root"));
// Handle Login Route
app.use("/auth", require("./routes/auth"));
app.use("/auth", require("./routes/register"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/api/loginhistories", require("./routes/loginhistoryRoute"));

// Require JWT Token to access data
app.use(verifyJWT);
// jwt protected routes
app.use("/api/users", require("./routes/api/usersRoute"));
app.use("/api/students", require("./routes/api/studentsRoute"));
app.use("/api/grades", require("./routes/api/gradesRoute"));
app.use("/api/employees", require("./routes/api/employeesRoute"));
app.use("/api/subjects", require("./routes/api/subjectsRoute"));
app.use("/api/tasks", require("./routes/api/taskRoute"));
app.use("/api/taskScore", require("./routes/api/taskScoreRoute"));

app.use("/api/levels", require("./routes/api/levelsRoute"));
app.use("/api/sections", require("./routes/api/sectionsRoute"));
app.use("/api/departments", require("./routes/api/departmentRoute"));
app.use("/api/schoolyears", require("./routes/api/schoolyearRoute"));
app.use("/api/enrolled", require("./routes/api/enrolledRoute"));

app.use(errorHandler);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "page", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
