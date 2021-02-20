const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Player = require("../models/Player");
const auth = require("../middleware/auth");

//get active players
router.get("/active", async (req, res) => {
  try {
    let arr = [];
    let players = await Player.find({ ready: true,city:req.query.city }).sort({ rating: -1 });
    while(players.length>=2){
        
    }
    return res.json(players);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Server error" });
  }
});

module.exports = router;
