const { createTransport } = require('nodemailer');

class OTPService {
  async generateOTP() {
    return (100000 + Math.floor(Math.random() * 900000)).toString();
}
  async sendEmail(email , otp){
    const transporter = createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
            user: process.env.gmail,
            pass: process.env.GMAIL_API_KEY,
        },
    });
    
    const mailOptions = {
        from: process.env.gmail,
        to: email,
        subject: `Mentora OTP`,
        text: `Your OTP is ${otp}`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
    async verifyOTP (inputOTP , realOTP){
    if (inputOTP === realOTP) {
        return true;
   } else {
     return false;
   }
}
}
module.exports = OTPService;
