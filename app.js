var express = require("express");
var app = express();
app.use(express.logger());

app.configure(function(){
	app.set("views", __dirname + "/views");
	app.set("view options", { layout: false }); 
	app.set("view engine", "ejs");
	app.use(express.static(__dirname + "/public"));
});

app.get("/", function(req, res){
	res.render("index.ejs");
});

var port = process.env.PORT || 1337;
app.listen(port, function() {
  console.log("Listening on " + port);
});