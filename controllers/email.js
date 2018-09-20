const nodemailer = require('nodemailer');
const {activationEmailTemplate,resetEmailTemplate} = require('./emailtemplate')
const {APPNAME,COMPANY} = require('../globals')
const sendActivationLink = (link,email)=>{
    
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
          host: process.env.SMTP,
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
              user: process.env.EMAIL_USERNAME, // generated ethereal user
              pass: process.env.EMAIL_PASSWORD // generated ethereal password
          }
      });

      // setup email data with unicode symbols
      let mailOptions = {
          from: `"${COMPANY}" <support@syncoders.com>`, // sender address
          to: email.toString(), // list of receivers
          subject: `${APPNAME} Activation link`, // Subject line
          text: `Activation link = ${link.toString()}`, // plain text body
          html: activationEmailTemplate(link,APPNAME,COMPANY,2018) // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return false
          }
          console.log(info)
          return true
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
  });
}

const sendResetLink = (link,email)=>{
    
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
          host: process.env.SMTP,
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
              user: process.env.EMAIL_USERNAME, // generated ethereal user
              pass: process.env.EMAIL_PASSWORD // generated ethereal password
          }
      });

      // setup email data with unicode symbols
      let mailOptions = {
          from: `"${COMPANY}" <support@syncoders.com>`, // sender address
          to: email.toString(), // list of receivers
          subject: `${APPNAME} Activation link`, // Subject line
          text: `Reset link = ${link.toString()}`, // plain text body
          html: resetEmailTemplate(link,APPNAME,COMPANY,2018) // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log(info)

          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
  });
}

module.exports = {
  sendActivationLink,
  sendResetLink
}

