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
    type: Object,
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
  win:{
    type: Number,
  },
  defeat: {
    type: Number,
  },
  games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"match"
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
