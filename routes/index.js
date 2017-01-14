var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var db = require('mongoose');
var User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/adduser').get(function(req, res){
	res.render('user');
})	

router.route('/adduser').post(function(req, res){
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
  					res.location("/adduser");
  					res.redirect("/adduser")
  				},
  				json: function(){
  					res.json(user);
					}
			})
			var recipient = user.email;
			var transport = nodemailer.createTransport(`smtps://${process.env.GMAIL_USERNAME}%40gmail.com:${process.env.GMAIL_PASSWORD}@smtp.gmail.com`);

      var email = {
          to: recipient,
          from: 'procleanservcommunity@gmail.com',
          subject: "Welcome To ProCleanServ",
          text: "Hello!\n\n Welcome to ProCleanServ. Stay tuned for updates on our launch date and service offerings on our platform!", 
      		html: 	`<p>Hey ${req.body.fname}!</p>
      						 <p>Welcome to ProCleanServ. 
	      							We are launching 
	      							a digital platform that will connect 
	      							cleaning professionals to clients and resources. 
	      							Clients can look forward to a centralized platform  
	      							that will allow them to find, schedule, 
	      							and pay for cleaning services. 
	      							We are looking forward to providing 
	      							clients and professionals these quality services in 2018.
      							</p>
      							<br>
      							<p>Cheers,</p>
      							<p>The Team at ProCleanServ<p>
      							<img src="http://image.flaticon.com/icons/svg/231/231920.svg" width=200px/>
      							` // html body
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
    }
	})
})

module.exports = router;
