const mongoose = require('mongoose');

// my schema goes here!
const soundSchema = new mongoose.Schema({
  what: String,
  where: String,
  date: String,
  hour: Number,
  desc: String
});

// "register" it so that mongoose knows about it
mongoose.model('Sound', soundSchema);


mongoose.connect('mongodb://localhost/hw05');
