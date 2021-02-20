const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  player1: {
    type: mongoose.Schema.Types.ObjectId,
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
  },
  date: {
    type: Date,
  },
  city: {
    type: String,
  },
  status: {
    type: String,
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
  },
  defeated: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = Match = mongoose.model("match", MatchSchema);
