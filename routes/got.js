
var express = require('express');
var router = express.Router();
var request = require("request");
var Promise = require('bluebird');

router.get('/', function(req, res, next) {
  res.render('got', { title: 'Express' });
});

router.route('/got').get(function(req, res) {
  var options = { 
    method: 'GET',
    url:'https://www.anapioficeandfire.com/api/characters/'
  };

  request(options, function(err, response, body){
    if(!err && response.statusCode === 200 ) {
    console.log(err)
    } 
  })
  return new Promise (function(resolve, reject){
    request(options, function(err, data){        
      if(err){
        reject(err);
      } else {
        resolve(data.body);
      }              
    });
  });   
});
/*
router.post('/adduser', function(req,res){
	var db = req.db;
  var userInfo = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

*/
/*

  User.create(userInfo)
    .then(function(data) {
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
*/
/*
function updateUser(req, res){
  var userInfo = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  User.findByIdAndUpdate(req.params.id, req.body, function(err, data){
    if (err) {
      return res.status(500).json({err: `Server error updating user ${err.message}`});
    }
      console.log(`Updating User data ${data}`);
      return res.status(200).json({userInfo: data});
  });
}
*/
//module.exports.taxes = taxes;
//module.exports.updateUser = updateUser;

module.exports = router;
