var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var app = express();
var PORT = process.env.PORT || 8080;

var db = require("./models");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set('views',path.join(__dirname, 'views'));
app.engine('handlebars',exphbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NewsScrape";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
// db.User.create({});
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});