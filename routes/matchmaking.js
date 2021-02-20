const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Player = require("../models/Player");
const auth = require("../middleware/auth");
const Match = require("../models/Match");

//daily check thing
router.get("/active", async (req, res) => {
  try {
    // let arr = [];
    let players;
    let players_filtered;
    let player;
    let player_array;
    let match;
    let match_array = [];
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
      (player) => player.activeTime != undefined && typeof activeTime != Array
    );

    while (players_filtered.length >= 2) {
      player = players_filtered[0];
      player_array = players_filtered.filter(
        (opponent) => opponent.activeTime.morning == true
        //   opponent.activeTime[0].start >= player.activeTime[0].start &&
        //   player.activeTime[0].end <= opponent.activeTime[0].end &&
        //   opponent.activeTime[0].start <= player.activeTime[0].end
      );
      if (player_array.length <= 1) {
        player_array = players_filtered.filter(
          (opponent) => opponent.activeTime.day == true
        );
      }
      if (player_array.length <= 1) {
        player_array = players_filtered.filter(
          (opponent) => opponent.activeTime.evening == true
        );
      }
      await Player.updateMany(
        { _id: player_array[0]._id && player_array[1]._id },
        { $set: { ready: false } }
      );
      match = new Match({
        player1: player_array[0]._id,
        player1: player_array[1]._id,
        status: "pending",
        city: player_array[0].city,
      });
      await match.save();
      match_array.push(match);
      //SEND STUFF TO FRONT OR WRITE INTO ARRAY
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
    return res.json({ array: match_array });
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

//decline match
router.delete("/match", auth, async (req, res) => {
  try {
    let match = await Match.findOne({ _id: req.body.id });
    if (!match) {
      return res.status(404).json({ err: "Матч не найден" });
    }
    match.status = "cancelled";
    await match.save();
    //do penalties?
    return res.json({ msg: "Матч отменен", match: match });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Server error" });
  }
});

//accept match
router.put("/match", auth, async (req, res) => {
  try {
    let match = await Match.findOne({ _id: req.body.id });
    if (!match) {
      return res.status(404).json({ err: "Матч не найден" });
    }
    if (match.status == "accepted") {
      match.status = "active";
      await match.save();
      return res.status(202).json(match);
    } else {
      match.status = "incoming";
      await match.save();
      return res.status(200).json(match);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Server error" });
  }
});

//finish match
router.put("/finish",auth,async(req,res)=>{
    try {
        let match = await Match.findOne({_id:req.body.id})
        match.status="finished"
    } catch (error) {
        console.error(error)
        return res.status(500).json({err:"Server error"})
    }
})
module.exports = router;
