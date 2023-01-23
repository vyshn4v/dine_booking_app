const nodemailer = require("nodemailer");
const { GMAIL_ADDRESS, GMAIL_PASSWORD } = require("../config/nodemailer");
const sendOtpViaMail = (otp = "", recieverEmail="") => {
    return new Promise((resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: GMAIL_ADDRESS, // generated ethereal user
                    pass: GMAIL_PASSWORD, // generated ethereal password
                },
            });
            transporter.sendMail({
                from: GMAIL_ADDRESS, // sender address
                to: recieverEmail, // list of receivers
                subject: "OTP verification", // Subject line
                // text: "your one time password for food zone application is 321999", // plain text body
                html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                            <div style="margin:50px auto;width:70%;padding:20px 0">
                              <div style="border-bottom:1px solid #eee">
                                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">FOOD ZONE</a>
                              </div>
                              <p style="font-size:1.1em">Hi,</p>
                              <p>Thank you for choosing food zone. Use the following OTP to complete your Sign Up procedures. OTP is valid for 6 minutes</p>
                              <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                              <p style="font-size:0.9em;">Regards,<br />FOOD ZONE</p>
                              <hr style="border:none;border-top:1px solid #eee" />
                              </div>
                              </div>`
                //   <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                //     <p>Your Brand Inc</p>
                //     <p>1600 Amphitheatre Parkway</p>
                //     <p>California</p>
                //   </div>
            })
            resolve(true)
        } catch (err) {
            resolve(false)
        }
    })
}

module.exports = sendOtpViaMail