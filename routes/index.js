var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var db = require('mongoose');
var User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/newuser', function(req, res, next) {
  res.render('index', { title: 'Sign Up' });
});

router.post('/adduser', function(req,res){
var db = req.db; 
  var userInfo = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  User.create(userInfo)
    .then(function(data) {
       console.log(JSON.stringify(data, null,2));
       return res.status(200).json({userInfo: data})
    }) 
    .then(function(user){
      var recipient = user.req.body.email;

      var opts = {
        host: '127.0.0.1',
        port: 8300
      };
      
      var transport = nodemailer.createTransport(`smtps://${process.env.GMAIL_USERNAME}%40gmail.com:${process.env.GMAIL_PASSWORD}@smtp.gmail.com`);

      var email = {
          to: recipient,
          from: 'softe1988@gmail.com',
          subject: "Test Message",
          text: "Hello!\n\nThis is my email message.",
          html: '<b>Hello world 🐴</b>' // html body
      };

      transport.sendMail(email, function(err, status) {
        console.log("email " +email);
        if(err) {
          console.log(err);
          return `Error sending email ${err.message}`;
          process.exit();
        }
          //res.redirect("") create success page
          console.log(`Message sent ${status.response}`);
      });
    })
    .catch(function(err) {
      if(err) {
        return res.status(500).json({err: `Server error creating user ${err.message}` });
      } 
  });
});

module.exports = router;
