var express = require('express');
var router = express.Router();
var email = require('emailjs');
var emailServer = email.server.connect({
	user: process.env.GMAIL_USERNAME,
	password: process.env.GMAIL_PASSWORD,
	//host: 'smtp.aol.com',
	host: 'smtp.gmail.com',
	port: 587,
	tls: {ciphers: 'SSLv3'}
});
var db = require('mongoose');
var User = require('../models/user.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
router.route('/adduser').get(function(req, res){ 
	var db = req.db;
	//var displayInfo = db.

	res.render('user');
	//console.log(`DISPLAY ${displayInfo}`)
})	
*/
router.route('/adduser').all(function(req, res, next){
	next();
})
	.get(function(req, res){ 
		var userdb = db.redux; 
		var user = userdb.count() 
		
		res.render("user", {
			displayName:{
				fname: user.fname,
				lname: user.lname,
				email: user.email
			}
	})
})		
.post(function(req, res){
	var db = req.db; 
  
  User.create({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    createdAt: Date.now(),
    updatedAt: Date.now()
  	}, 
  	function(err, user){
			if(err){
  			res.send("There was a problem creating a new user try again")
  		} else{
  			console.log(`creating new user ${JSON.stringify(user, null, 2)}`)
  			res.format({
  				html: function(){
						res.render("user", {
							displayName:{
								fname: user.fname,
								lname: user.lname,
								email: user.email
							}  
						})
					}
			})
			var recipient = user.email;
		
      var email = {
          to: recipient,
					from: 'technicalrecruiter88@gmail.com',
          subject: "Welcome To Fusion Conf",
          text: `Hello ${req.body.fname},\n\n Welcome to the Fusion Conf Community! We are looking forward to providing clients and professionals these quality conferences in 2018. Stay tuned for updates on our launch date and service offerings on our platform! \n\n Cheers, \n The Team At FusionConf`, 
					
      };

      emailServer.send(email, function(err, status) {
        console.log(`email ${email}`);
        if(err) {
          console.log(err);
          return `Error sending email ${err.message}`;
          process.exit();
        }
          console.log(`Message sent ${status.response}`);
			});
		}
	})
})

module.exports = router;
