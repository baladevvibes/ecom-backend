const forgotPasswordTemplate = (data) => {
    
    
    return `
    <div>
    <p> Dear  ${data.name}</p>
    <p>
    You're requested a password reset. Please use following OTP code to reset your password</p>
    <div style="background:yellow" >
${data.otp}
    </div>
    <p>This otp is vaild for 1 hour only. Enter this otp in the app website to proceed with resetting your password 
    </p>
    </br>
    <p>Thanks</p>
    <p>App</p>
    </div>
    `
}

module.exports = forgotPasswordTemplate