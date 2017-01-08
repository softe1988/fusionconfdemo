var nodemailer = require('nodemailer');

function welcomeEmail(user) {
  var recipient = user.req.body.email;

  var opts = {
    host: '127.0.0.1',
    port: 8300
  };

  var transport = nodemailer.createTransport(`smtps://${process.env.GMAIL_USERNAME}%40gmail.com:${process.env.GMAIL_PASSWORD}@smtp.gmail.com`);

  // Construct the email
  var email = {
      to: recipient,
      from: 'softe1988@gmail.com',
      subject: "Test Message",
      text: "Hello!\n\nThis is my email message.",
      html: '<b>Hello world 🐴</b>' // html body
  };

  // Send the Email

  transport.sendMail(email, function(err, status) {
    if(err) {
      console.log(err);
      return `Error sending email ${err.message}`;
      process.exit();
    }
      console.log("message send " + status.response);
      //return `Message sent ${status.response}`
  });
}

module.exports.welcomeEmail = welcomeEmail;