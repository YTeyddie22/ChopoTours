const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  //*1 Create a transporter.

  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    PORT: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  });

  //*2 Create an email option.

  const mailOption = {
    from: "Teddy Yongo <test6@teddy.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //*3 Send Email.

  await transporter.sendMail(mailOption);
};

module.exports = sendMail;
