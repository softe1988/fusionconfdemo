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

router.get('/', function (req, res){ 
		
	User.find({}).exec(function(err, usr){
		if(err) {
			console.log(`Error: ${err}`);
		}
			console.log(`USERS ${usr}`)
			res.render('users', {users: usr});
	})
});

router.post('/users/edit/:id', function (req, res){ 
	let id = req.params.id;

	User.findById(id, function(err, usr){
		if(!usr) {
			console.log(`Error: ${err}`);
		} 
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
	});
});

router.get('/users/delete/:id', function (req, res){ 
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

router.get('/users/edit/:id', function (req, res){ 
	let id = req.params.id;

	User.findById(id, function(err, usr){
		if(!usr) {
			console.log(`Error: ${err}`);
		}
		res.render('editUser', {users: usr})
		
		usr.fname = req.body.fname;
		usr.lname = req.body.lname;
		usr.email = req.body.email;

	})
});

router.route('/adduser').all(function(req, res, next){
	next();
})
.get(function(req, res){ 
	res.render("index");
})		
.post(function(req, res){
  	User.create(
	{
    	fname: req.body.fname,
    	lname: req.body.lname,
    	email: req.body.email,
    	createdAt: Date.now(),
    	updatedAt: Date.now()
  	}, 
  	function(err, user){
		if(err){
  			res.send("There was a problem creating a new user try again")
  		}	
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
          	subject: "New User Created on GoT Character Search",
          	text: `Hello ${req.body.fname},\n\n Thanks for contributing to GoT Character Search! We hope the new Character you created is spelled correctly, or you will have to bend the knee to the King of the North and Mother of Dragons. \n\n Cheers, \n The GoT Character Search Team`, 
					
      	};

      	emailServer.send(email, function(err, status) {
        	console.log(`email ${email}`);
        	if(err) {
          		console.log(err);
          		return `Error sending email ${err.message}`;
        	}
			console.log(`Message sent ${status.response}`);
		});
	})
})

router.get('/got/api/:id', function(req, res) {
	console.log(`PARAMS ${req.params.id}`)
	let id = req.params.id;
  
	let query = User.findById(id, function(err, usr){
		if(!usr) {
			console.log(`Error: ${err}`);
		} 
		
		console.log(`The User ${usr.fname}`)
		return usr;
		
	});

	query.exec().then(user => {
		let options = { 
			method: 'GET',
			url:`https://www.anapioficeandfire.com/api/characters?name=${user.fname} ${user.lname}`
		};
		
		request(options, function(err, response, body){
			if(!err && response.statusCode === 200 ) {
				console.log(err)
			} 
			return new Promise (function(resolve, reject){
				request(options, function(err, data){     
					console.log(`data ${data}`)  
					if(err){
						reject(err);
					} else {
						var info = JSON.parse(data.body)

						console.log(`HERE ${info[0]}`)
						resolve(info.body);
						res.render('got', {info: info})
						//res.json(data.body)
					}              
				});
			}); 
		
		})	
	})
	.catch(err => {
		return res.status(400).send("unable to update user");
	})
	
});

module.exports = router;
