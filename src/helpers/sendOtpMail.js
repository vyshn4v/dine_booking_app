const nodemailer = require("nodemailer");
const sendOtpViaMail = (otpText = "", recieverEmail = "") => {
    return new Promise((resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.GMAIL_ADDRESS, // generated ethereal user
                    pass: process.env.GMAIL_PASSWORD, // generated ethereal password
                },
            });
            transporter.sendMail({
                from: process.env.GMAIL_ADDRESS, // sender address
                to: recieverEmail, // list of receivers
                subject: "OTP verification", // Subject line
                // text: "your one time password for food zone application is 321999", // plain text body
                html: otpText
            })
            resolve(true)
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = sendOtpViaMail