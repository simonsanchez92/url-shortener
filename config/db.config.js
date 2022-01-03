const mongoose = require("mongoose");

const URL =
  "mongodb+srv://simonsanchez1992:harvester92@url-shortener-cluster.udwzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

module.exports = connection;
