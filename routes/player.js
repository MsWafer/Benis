const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Player = require("../models/Player");
const auth = require("../middleware/auth");

//reg
router.post("/", async (req, res) => {
  if (!req.body) {
    return res.json("huy");
  }

  let { email, pwd, login } = req.body;
  if (!email || !login || !pwd) {
    return res.json({ msg: "Заполните все поля" });
  }
  try {
    let check = await Player.findOne({ email });
    if (check) {
      return res.json({ err: "Пользователь с указанным email уже найден" });
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(pwd, salt);
    let player = new Player({
      email,
      login,
      password,
    });
    await player.save();
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: 360000000 },
      (err, token) => {
        if (err) throw err;
        res.json({
          token: token,
          id: player.id,
          msg: "Z D A R O V A",
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Server error" });
  }
});

//auth
router.post("/auth", async (req, res) => {
  try {
    if (!req.body.login || !req.body.password) {
      return res.status(401).json({ err: "Введите логин и пароль" });
    }
    let player = await Player.findOne({ login: req.body.login });
    if (!player) {
      return res
        .status(404)
        .json({ err: "Пользователь с указанным логинои не найден" });
    }
    const isMatch = await bcrypt.compare(password, player.password);
    if (!isMatch) {
      return res.status(400).json({ err: "Неверный пароль" });
    }

    const payload = {
      player: {
        id: player.id,
      },
    };
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: 360000000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Server error" });
  }
});

//get me
router.get("/me", auth, async (req, res) => {
  try {
    let player = await Player.findOne({ _id: req.player.id });
    if (!player) {
      return res.status(400).json({ err: "Якась хуйня" });
    }
    return res.json(player);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Server error" });
  }
});

//edit me
router.put("/me/edit", auth, async (req, res) => {
  try {
    let player = await Player.findOne({ _id: req.player.id });
    if (!player) {
      return res.status(404).json({ err: "Пользователь не найден" });
    }
    let { name, lastname, hours, city } = req.body;
    player.name = name;
    player.lastname = lastname;
    player.fullname = lastname + " " + name;
    player.activeTime.push(hours);
    player.city = city;
    await player.save();
    return res.json(player);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Server error" });
  }
});

//get other player
router.get("/find", auth, async (req, res) => {
  try {
    let response;
    if (req.query.field == "all") {
      response = await Player.find();
    } else if (req.query.field == "city") {
      response = await Player.find({ city: req.query.value });
    } else if (req.query.field == "id") {
      response = await Player.findOne({ _id: req.query.value });
    } else {
      response = "Фронтэндер хуй соси";
    }
    return res.json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Server error" });
  }
});

//start/stop searching
router.put("/go", auth, async (req, res) => {
  try {
    let player = await Player.findOne({ _id: req.player.id });
    if (!player) {
      return res.status(400).json({ err: "Хуйня якась" });
    }
    player.ready = !player.ready;
    await player.save();
    return res.json({ msg: "Статус изменен" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Server error" });
  }
});

//remove active hours
router.delete("/h", auth, async (req, res) => {
  try {
    let player = await Player.findOne({ _id: req.player.id });
    if (!player) {
      return res.status(400).json({ err: "Хуйня якась" });
    }
    let delhour = player.activeTime.filter((time) => time._id == req.body.id);
    await Player.findOneAndUpdate(
      { _id: req.player.id, "activeHours._id": req.body.id },
      { $pull: { activeTime: delhour } }
    );
    return res.json({ player });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Server error" });
  }
});

module.exports = router;
