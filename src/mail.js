const nodemailer = require("nodemailer");

const googleUserEmail = process.env.GOOGLE_MAILER_EMAIL;
const googleUserPassword = process.env.GOOGLE_MAILER_PASSWORD;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: googleUserEmail,
    pass: googleUserPassword,
  },
});

var mailOptions = {
  from: "elkarloshunkbloodz@gmail.com",
  to: "sibalatanics@outlook.com",
  subject: "Sending Email using node.js",
  text: "Hello world",
  attachments: [
    {
      filename: "article.pdf",
      content,
    },
  ],
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) console.log(error);
  else console.log("Email sent:" + info.response);
});
