const nodemailer = require("nodemailer");
const sendcancelMail = (otpText = "", recieverEmail = "") => {
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
                subject: "Order canceled", // Subject line
                // text: "your one time password for food zone application is 321999", // plain text body
                html: otpText
            })
            resolve(true)
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = sendcancelMail