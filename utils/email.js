const pug = require("pug");
const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");

/**
 *! An email handler  (Simplified);
 */
/*

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

*/

/**
 *
 * ! Creating a new Email class (Complex);
 *
 * * MAil trap prevents leaking of Emails to real life users.
 */

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Teddy Yongo <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      /**
       * We will use SendGrid
       * TODO since there is an error.
       */
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      PORT: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    /**
     * Render HTML based on PUG template;
     * Define email options;
     *
     */
    //* 1 Render HTML based on PUG template;

    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    //* 2 Define email options;
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    //* 3 Create a transport and send email;

    await this.newTransport().sendMail(mailOptions);
  }

  //? This is the first email when Signing up
  async sendWelcome() {
    await this.send("welcome", "Welcome to the ChopoTours Family!");
  }

  //? This is the password reset mail;
  async sendPasswordReset() {
    await this.send(
      "resetPassword",
      "Your password reset token (Valid for 10 minutes)"
    );
  }
};
