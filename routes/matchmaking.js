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
    // let arr = [];
    let players;
    let players_filtered;
    let player;
    let player_array;
    Object.defineProperty(Array.prototype, "chunk", {
      value: function (chunkSize) {
        var R = [];
        for (var i = 0; i < this.length; i += chunkSize)
          R.push(this.slice(i, i + chunkSize));
        return R;
      },
    });

    players = await Player.find({
      ready: true,
      city: req.query.city,
    }).sort({ rating: -1 });
    players_filtered = players.filter(
      (player) => player.activeTime.length != 0
    );

    while (players_filtered.length >= 2) {
      player = players_filtered[0];
      player_array = players_filtered.filter(
        (opponent) =>
          opponent.activeTime[0].start >= player.activeTime[0].start &&
          player.activeTime[0].end <= opponent.activeTime[0].end &&
          opponent.activeTime[0].start <= player.activeTime[0].end
      );
      await Player.updateMany(
        { _id: player_array[0]._id && player_array[1]._id },
        { $set: { ready: false } }
      );
      players = await Player.find({
        ready: true,
        city: req.query.city,
      }).sort({ rating: -1 });
      players_filtered = players.filter(
        (player) => player.activeTime.length != 0
      );
    }

    // let goa = arr2.map((el, ind) => {
    //     for(let i = ind+1; i<arr2.length; i++){
    //         // console.log(arr2[i].activeTime[0].start)
    //         (arr2[i].activeTime[0].start>=el.activeTime[0].start)&&(el.activeTime[0].end<=arr2[i].activeTime[0].end)
    //     }

    // })
    // let arr = arr2.filter((player)=>(console.log(player2),player2.activeTime[0].start>=player.activeTime[0].start)&&(player.activeTime[0].end<=player2.activeTime[0].end))
    // while(players.length>=2){
    //     arr.push.apply(arr,[players[0],players[1]])
    //     await Player.updateMany({_id:players[0]._id&&players[1]._id},{$set:{ready:false}})
    //     players = await Player.find({ ready: true,city:req.query.city }).sort({ rating: -1 });
    // }
    //   console.log(players)
    // return res.json(players.chunk(2)[1]);
    return res.json({ player0: player, array: player_array });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Server error" });
  }
});

//govno
router.get("/govno", async (req, res) => {
  await Player.updateMany({}, { $set: { ready: true } });
  return res.json({ msg: "huy" });
});

module.exports = router;
