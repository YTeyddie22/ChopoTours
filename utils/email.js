const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //*1 Create a transporter.

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    PORT: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //*2 Create an email option.

  const mailOptions = {
    from: `Teddy Yongo <${options.email}>`,
    to: `${options.email}`,
    subject: `${options.subject}`,
    text: options.responseMessage,
  };

  //*3 Send Email.

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
