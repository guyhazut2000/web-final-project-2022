const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const userRoute = require("./routes/user");
const courseRoute = require("./routes/course");
const gradesRoute = require("./routes/grades");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/courses", courseRoute);
app.use("/api/grades", gradesRoute);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

//start server
app.listen(process.env.PORT || process.env.MONGO_PORT, () => {
  console.log("Backend server is running!");
});
