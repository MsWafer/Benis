const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  fullname: {
    type: String,
  },
  login: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  activeTime: {
    monday: {
      start: { type: Number, default: 0 },
      end: { type: Number, default: 1 },
      active: { type: Boolean, default: false },
    },
    tuesday: {
      start: { type: Number, default: 0 },
      end: { type: Number, default: 1 },
      active: { type: Boolean, default: false },
    },
    wednesday: {
      start: { type: Number, default: 0 },
      end: { type: Number, default: 1 },
      active: { type: Boolean, default: false },
    },
    thursday: {
      start: { type: Number, default: 0 },
      end: { type: Number, default: 1 },
      active: { type: Boolean, default: false },
    },
    friday: {
      start: { type: Number, default: 0 },
      end: { type: Number, default: 1 },
      active: { type: Boolean, default: false },
    },
    saturday: {
      start: { type: Number, default: 0 },
      end: { type: Number, default: 1 },
      active: { type: Boolean, default: false },
    },
    sunday: {
      start: { type: Number, default: 0 },
      end: { type: Number, default: 1 },
      active: { type: Boolean, default: false },
    },
  },
  ready: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  city: {
    type: String,
  },
  games: [
    {
      opponent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "player",
      },
      playerScore: {
        type: Number,
      },
      oppScore: {
        type: Number,
      },
      win: {
        type: Boolean,
      },
      date: {
        type: Date,
      },
    },
  ],
  warning: [
    {
      date: {
        type: Date,
      },
      reason: {
        type: String,
      },
      active: {
        type: Boolean,
        default: true,
      },
    },
  ],
  penalty: [
    {
      date: {
        type: Date,
      },
      active: {
        type: Boolean,
      },
    },
  ],
  contacts: {
    type: Object,
  },
});

module.exports = Player = mongoose.model("player", PlayerSchema);
