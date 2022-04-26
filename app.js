//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const alert = require('alert');

const func = function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/dailyjournal", {
  useNewUrlParser: true
});

const composeSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Compose = mongoose.model("Compose", composeSchema);

const signSchema = new mongoose.Schema({
  fName: String,
  lName: String,
  email: String,
  content: String
});
const Sign = mongoose.model("Sign", signSchema);

app.get("/", function(req, res) {

  Compose.find({}, function(err, foundCompose) {
    if (!err) {
      if (foundCompose) {
        res.render("home", {
          newPost: foundCompose,
          func: func,
        });
      }
    }
  });

});


app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/success",function(req,res)
{
  res.render("success");
});

app.post("/contact", function(req, res) {

  Sign.findOne({
    email: req.body.email
  }, function(err, foundSign) {
    if (!err) {
      if (foundSign) {
        alert("This email already signed up! please try again");
      } else {
        const sign = new Sign({
          fName: req.body.fName,
          lName: req.body.lName,
          email: req.body.email,
          content: req.body.details
        });
        sign.save(function(err) {
          if (!err) {
            res.redirect("/success");
          }
        });
      }
    }
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get('/posts/:postId', function(req, res) {

  const nameRequest = req.params.postId;

  Compose.findOne({
    _id: nameRequest
  }, function(err, foundPost) {
    if (!err) {
      if (!foundPost) {
        res.redirect("/");
      } else {
        res.render("post", {
          newTitle: foundPost.title,
          newBody: foundPost.body
        });
      }
    }
  })
});

app.post("/compose", function(req, res) {

  const compose = new Compose({
    title: req.body.postTitle,
    body: req.body.postBody
  });

  compose.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
