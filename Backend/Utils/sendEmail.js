const nodeMailer = require("nodemailer");
const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
     user: 'umairashraf8765@gmail.com',
     pass: 'gummngdtfzoiruzh',
    },
    // host: process.env.SMPT_HOST,
    // port: process.env.SMPT_PORT,
    // service: process.env.SMPT_SERVICE,
    // secure: true,
    // auth: {
    //     user: process.env.SMPT_MAIL,
    //     pass: process.env.SMPT_PASSWORD
    // }
});
const sendEmail = async(options)=>{
    
   
    const mailOptions = {
        from: "umairashraf8765@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message,
    }
    await transporter.sendMail(mailOptions,function (error, info) {
        if (error) {
          console.log('Error in sending email  ' + error);
          return true;
        } else {
         console.log('Email sent: ' + info.response);
         return false;
        }
       });
}
module.exports = sendEmail;