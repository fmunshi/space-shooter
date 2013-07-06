var express = require("express");
var app = express();

app.configure(function(){
	app.set("views", __dirname + "/views");
	app.set("view options", { layout: false }); 
	app.set("view engine", "ejs");
	app.use(express.static(__dirname + "/public"));
});

app.get("/", function(req, res){
	res.render("index.ejs");
});


var http = require('http');
var cronJob = require('cron').CronJob;

new cronJob('0,30 * * * *', function(){
  http.get(
    {
      host: 'spaceshooter.herokuapp.com',
      port: 80
    },
    function(response) {
      response.on('end', function () {
      console.log('Site reactivated');
    });
  }).on('error', function(e) {
    console.log('ERROR: ' + e.message);
  });
}, null, true);


var port = process.env.PORT || 1337;

app.listen(port, function() {
  console.log("Listening on " + port);
});