const mongoose = require('mongoose');

// this is our schema to represent a Board Game
const boardGameSchema = mongoose.Schema({
  name: {type: String, required: true},
  players: {
    min: String,
    max: String
  },
  genre: {type: String, required: true},
  plays: [{
    date: Date,
    players: Number,
  }]
});

boardGameSchema.virtual('numOfPlayers').get(function() {
  return `${this.players.min} to ${this.players.max}`.trim()});

boardGameSchema.virtual('lastPlayDate').get(function() {
  const playDateObj = this.plays.sort((a, b) => {return b.date - a.date})[0] || {};
  return playDateObj.lastPlayDate;
});

boardGameSchema.methods.apiRepr = function() {

  return {
    id: this._id,
    name: this.name,
    players: this.numOfPlayers,
    plays: this.plays.length,
  };
}

const BoardGame = mongoose.model('BoardGame', boardGameSchema);

module.exports = {BoardGame};