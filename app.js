if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var nodemailer = require("nodemailer");

const app = require("http").createServer((req, res) => res.send("Hacker News Jobs Emailer Sender Running!!"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.FROM_PASSWORD,
  },
});

let mailOptions = {
  from: process.env.FROM_EMAIL,
  to: process.env.FROM_EMAIL,
  subject: "Latest 'Ask HN: Who's Hiring?' Post",
  text: "test",
};

sendMailInterval = () => {
  console.log("sending mail...");
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent:" + info.response);
    }
  });
};

setInterval(sendMailInterval, 5000);
