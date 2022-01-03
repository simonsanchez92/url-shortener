require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const shortid = require("shortid");

//Import URL model
const Url = require("./models/UrlModel");
const UrlModel = require("./models/UrlModel");

const connection = require("./config/db.config");
connection.once("open", () => console.log("DB Connected!"));
connection.on("error", () => console.log("There has been an error!"));

// Basic Configuration
// const port = process.env.PORT || 3000;
const port = 3000;
app.use("/public", express.static(`${process.cwd()}/public`));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async (req, res, next) => {
  const formUrl = req.body.url;

  if (!validURL(formUrl)) {
    res.json({ error: "invalid url" });
  } else {
    try {
      let url = await UrlModel.findOne({ original_url: formUrl });

      if (url) {
        res.json({ original_url: url.original_url, short_url: url.short_url });
        console.log("Already exists in database!");
      } else {
        const urlCode = shortid.generate();
        url = new UrlModel({
          short_url: urlCode,
          original_url: formUrl,
        });

        await url.save();

        res.json({ original_url: url.original_url, short_url: url.short_url });
      }
    } catch (e) {
      console.log(e);
    }
  }
});

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

app.get("/api/shorturl/:urlCode", async (req, res, next) => {
  const urlCode = req.params.urlCode;

  if (!urlCode.trim()) {
    return res.json({ error: "invalid url" });
  }

  try {
    const urlFromDB = await UrlModel.findOne({ short_url: urlCode });

    if (urlFromDB) {
      res.redirect(urlFromDB.original_url);
    } else {
      res.json({ error: "invalid url" });
    }
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
