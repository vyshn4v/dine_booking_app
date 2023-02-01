function otpTextGenerator(otp = " ", type) {
  let template = "";
  if (type == "welcome-back") {
    template = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">FOOD ZONE</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>welcome back to food zone. Use the following OTP to complete your Login procedures. OTP is valid for 1 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />FOOD ZONE</p>
    <hr style="border:none;border-top:1px solid #eee" />
    </div>
    </div>`
  } else if (type == "verify-profile") {
    template = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
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
  } else if (type == "forgot-password") {
    template = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">FOOD ZONE</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p> Use the following OTP to complete your forgot password procedures. OTP is valid for 1 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />FOOD ZONE</p>
    <hr style="border:none;border-top:1px solid #eee" />
    </div>
    </div>`
  }
  return template
}

module.exports = otpTextGenerator