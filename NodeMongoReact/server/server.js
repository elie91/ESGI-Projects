const express = require("express");
const cors = require("cors");
const { User } = require("./models/sequelize");
const RouterManager = require("./routes");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/hello", (req, res, next) => {
  console.log(req.query);
  res.json({ msg: "Hello" });
});

RouterManager(app);

app.listen(3000, () => console.log("listening..."));
