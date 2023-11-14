const nodemailer = require("nodemailer");

const sendMail = async (email, subject, url) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    var message;
    if (subject === "Verify your email") {
      message = `<p>Hello,</p>
        <p>Please click the following link to verify your email:</p>
        <a href="${url}">Verify Email</a>`;
    } else {
      message = `<p>Hello,</p>
      <p>Please click the following link to reset your password:</p>
      <a href="${url}">Reset Password</a>`;
    }

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: message,
    });
    console.log("Email sent successfully");
  } catch (error) {
    return error;
  }
};

module.exports = sendMail;
