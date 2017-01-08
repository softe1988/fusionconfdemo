var nodemailer = require('nodemailer');

function welcomeEmail(user) {
  var recipient = user.req.body.email;
  var username = user.req.body.fname;

  var opts = {
    host: '127.0.0.1',
    port: 8300
  };

  var transport = nodemailer.createTransport(`smtps://${process.env.GMAIL_USERNAME}%40gmail.com:${process.env.GMAIL_PASSWORD}@smtp.gmail.com`);

  // Construct the email
  var email = {
      to: recipient,
      from: 'softe1988@gmail.com',
      subject: "Welcome To ProCleanServ",
      text: "Hello!\n\n Welcome to ProCleanServ. Stay tuned for updates on our launch date and service offerings on our platform!", 
      html: `<p>Hello ${username}: </p><br> <p>Welcome to ProCleanServ. We are getting ready to launch a digital platform that will connect cleaning professionals to clients and resources such as training and equipment. We also want to provide a centralized platform for clients to find, schedule, and pay for services. We are looking forward to proving you these quality sevices in 2018.</p><br><br> <p>Cheers,</p><br><p>The Team at ProCleanServ<p>` // html body
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