const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Player = require("../models/Player");

//reg
router.post("/", async (req, res) => {
  let { email, password, login, name, lastname } = req.body;
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
      name: name,
      lastname: lastname,
      fullname: lastname + " " + name,
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
