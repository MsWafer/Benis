const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./middleware/db");
connectDB;

const app = express();
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => res.send("bepis"));

const PORT = process.env.PORT || 1488;

app.listen(PORT, () => console.log(`Benis on ${PORT}`));
