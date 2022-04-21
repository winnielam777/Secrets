//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);



app.get("/", function(req,res) {
  res.render("home");
});

app.get("/login", function(req,res) {
  res.render("login");
});

app.get("/register", function(req,res) {
  res.render("register");
});

app.post("/register", function(req,res) {
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if(err) {
      console.log(err);
    } else
    res.render("secrets");
  });
});

app.post("/login", function(req,res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    if(err) {
      console.log(err);
    } else {
      if(foundUser) {
        if (foundUser.password===password) {
          res.render("secrets");
          console.log(foundUser);
        }
      }
    }
  })
});


app.listen(3000, function() {
  console.log("Server has started successfully on port 3000");
});

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }
//
// app.listen(port, function() {
//   console.log("Server has started successfully");
// });
