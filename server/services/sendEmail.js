const expressAsyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const generateOTP = require('./generateOTP');
dotenv.config();

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === 465,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

// sendEmail middleware using async/await
const sendEmail = expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    // Simple email validation (for more robust validation consider using a library like validator.js)
    if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.status(400).send('Invalid email address.');
    }

    const otp = generateOTP();

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: 'OTP from Callback Coding',
        text: `Your OTP is: ${otp}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info);
        const data = {
            email: email,
            otp: otp
        }
        res.status(200).send(data);
    } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).send('Failed to send email.');
    }
});

module.exports = { sendEmail };
