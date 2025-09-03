const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSKEY,
    },
});


// Main function
const sendEmailUser = async ({sendTo, Subject, html}) => {
    const mailOptions = {
        from: `Binkeyit ${process.env.EMAIL}`,
        to: sendTo,
        subject: Subject,
        html:html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent:");
    } catch (err) {
        console.error("Error sending email:", err);
    }
};

module.exports = sendEmailUser;