const mongoose = require("mongoose");

const UrlSchema = mongoose.Schema({
  short_url: String,
  original_url: String,
  date: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Url", UrlSchema);
