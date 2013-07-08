var express = require("express");
var app = express();
var mongoose = require("mongoose");

var db = mongoose.createConnection('localhost', 'space');

db.on('error', function(err){
  console.log('MongoDB connection error:', err);
});

db.once('open', function () {
    console.log("Open Mongo Connection");
});


app.configure(function(){
	app.set("views", __dirname + "/views");
	app.set("view options", { layout: false }); 
	app.set("view engine", "ejs");
	app.use(express.static(__dirname + "/public"));
  app.use(express.bodyParser());
});

var UserSchema = new mongoose.Schema({
  name        :   {
    type      : String, 
    required  : true, 
    unique    : true,
    lowercase : true
  },
  password    :   String,

  fireRate    :   Number,
  maxSpeed    :   Number,

  maxHealth   :   Number,
  maxHeat     :   Number,

  damage      :   Number,
  defense     :   Number,
  luck        :   Number,
  exp         :   Number,
  level       :   Number
});

var User = db.model('User', UserSchema);
user = User.find();
user.remove();


app.get("/", function(req, res){
	res.render("index.ejs");
});

app.get("/:name/password", function(req, res){
  var name = req.params.name;
  User.find({ name: user.name }, function (err, user) {
    console.log(user);
  });
});



app.post("/login", function(req, res){
  console.warn(req.body);
  var user = req.body;
  var found = false;

    var existingUser = User.findOne({ name: user.name }, function(err, u){
      if (err) throw err;
      else if (u.name === user.name){
        console.log('User Exists');
        console.log(u);
        res.send(u);
      }
      else {
        var newUser = new User({
          name        :   user.name,
          password    :   user.password,
          fireRate    :   100,
          maxSpeed    :   15,
          maxHealth   :   1000,
          maxHeat     :   1000,
          damage      :   100,
          defense     :   100,
          luck        :   0.1,
          exp         :   100,
          level       :   1
        });

        newUser.save(function(err){
          if(err) throw err;
          else {
            console.log(newUser);
            res.send(newUser);    
          }
        });
      }
    });
});

app.post('/save', function(req, res){
  var user = req.body.payload;
  console.log(user);
  User.findOne({ name: user.name }, function (err, u){
    for (var stat in user){
      u[stat]= user[stat]
    }
    u.save();
    console.log(u);
    res.send(u);
  });
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});