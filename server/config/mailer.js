const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // or "outlook", or use host/port for custom SMTP
    auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password or real password
    },
});

async function sendEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: `"LawMate Billing" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("📧 Email sent:", info.messageId);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}

module.exports = sendEmail;
