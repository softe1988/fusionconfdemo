let express = require('express')
	router = express.Router()
 	email = require('emailjs')
	emailServer = email.server.connect({
		user: process.env.GMAIL_USERNAME,
		password: process.env.GMAIL_PASSWORD,
		host: 'smtp.gmail.com',
		port: 587,
		tls: {ciphers: 'SSLv3'}
	})
	db = require('mongoose')
	User = require('../models/user.js')
	request = require("request")
	Promise = require('bluebird');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/users').get(function (req, res){ 
		
	User.find({}).exec(function(err, usr){
		if(err) {
			console.log(`Error: ${err}`);
		}
			console.log(`USERS ${usr}`)
			res.render('users', {users: usr});
	})
});

router.route('/users/edit/:id').post(function (req, res){ 
	var id = req.params.id;

	User.findById(id, function(err, usr){
		if(!usr) {
			console.log(`Error: ${err}`);
		} else 
		{
		
			usr.fname = req.body.fname;
			usr.lname = req.body.lname;
			usr.email = req.body.email;


			usr.save().then(user => {
				User.find({}).exec(function(err, usr){
					if(err) {
						console.log(`Error: ${err}`);
					}
						console.log(`USERS ${usr}`)
						res.render('users', {users: usr});
				})	
			})
				.catch(err => {
				return res.status(400).send("unable to update user");
			})
		}
	});
});

router.route('/users/delete/:id').get(function (req, res){ 
	var id = req.params.id;

	User.findByIdAndRemove({_id: id}, function(err, usr){
		if(err) {
			console.log(`Error: ${err}`);
		} 
		User.find({}).exec(function(err, usr){
			if(err) {
				console.log(`Error: ${err}`);
			}
				console.log(`USERS ${usr}`)
				res.render('users', {users: usr});
		})	
	});			
});

router.route('/users/edit/:id').get(function (req, res){ 
	var id = req.params.id;

	User.findById(id, function(err, usr){
		if(!usr) {
			console.log(`Error: ${err}`);
		}
		res.render('editUser', {users: usr})
		
		usr.fname = req.body.fname;
		usr.lname = req.body.lname;
		usr.email = req.body.email;

		/*
		usr.save().then(data => {
			res.redirect('users');
		})
		.catch(err => {
			res.status(400).send("unable to update user");
		})
		*/
	})
});

router.route('/adduser').all(function(req, res, next){
	next();
})
	.get(function(req, res){ 
		
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

router.route('/got/api/:id').get(function(req, res) {
	console.log(`PARAMS ${req.params.id}`)
	let id = req.params.id;
  
	/*
	let character = User.findById(id, function(err, usr){
		if(!usr) {
			console.log(`Error: ${err}`);
		} 
		
		console.log(`The User ${usr.fname}`)
		return usr;
	});
	*/
	let query = User.findById(id, function(err, usr){
		if(!usr) {
			console.log(`Error: ${err}`);
		} 
		
		console.log(`The User ${usr.fname}`)
		return usr;
			/* 
			 usr.fname = req.body.fname;
			  usr.lname = req.body.lname;
			  usr.email = req.body.email;
		*/
	});


  
	query.exec().then(user => {
		let options = { 
			method: 'GET',
			url:`https://www.anapioficeandfire.com/api/characters?name=${user.fname} ${user.lname}`
		};
		
		request(options, function(err, response, body){
			console.log(`BODY ${body}`)
			console.log(`BODY ${options.url}`)
			
			if(!err && response.statusCode === 200 ) {
			console.log(err)
			} 
			
				return new Promise (function(resolve, reject){
					request(options, function(err, data){     
						console.log(`data ${data.body}`)  
						if(err){
							reject(err);
						} else {
							console.log(`HERE ${data}`)
							resolve(data.body);
							res.render('got', {info: data})
						}              
					});
				}); 
			})	
		})
		.catch(err => {
			return res.status(400).send("unable to update user");
		})
	});
//});

module.exports = router;
