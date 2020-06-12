if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const nodemailer = require("nodemailer");
const fetch = require('node-fetch');


const app = require("http").createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end("Hacker-News-Jobs-Emailer-Sender-Running!!");
});

const PORT = process.env.PORT || 8080;
const ASK_HN_URL = 'https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty';
const HN_ITEM_URL = 'https://hacker-news.firebaseio.com/v0/item/.json?print=pretty';

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

let pollHackerNews = async () => {
    //final list of HN urls to send by email

    //Get up to 200 of the latest Ask HN stories
    const response = await fetch(ASK_HN_URL);
    const json = await response.json();

    let idLocation = HN_ITEM_URL.indexOf('.json');
    const regex = /.json/gi;

    //insert the item id from every fetched story into the item url
    let itemURLs = json.map( item => {
        return HN_ITEM_URL.replace(regex, item + '.json');
    }); 

    //filter the urls for 'Ask HN' text
    const finalURLs = await itemURLs.map(async (item) => {

        const response = await fetch(item);
        const json = await response.json();

        let storyTitle = json.title;
        if (storyTitle.includes('Ask HN'/*: Who is hiring?*/)){
            let storyID = json.id;
            return 'https://news.ycombinator.com/item?id=' + storyID + '\n';
        }
    });

    //remove undefined urls from final list
    return (await Promise.all(finalURLs)).filter(url => url !== undefined).toString();
};

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
};

sendMailInterval = async () => {

  let finalURLs = await pollHackerNews();
  console.log("finalURLs done", finalURLs);
  mailOptions.text = finalURLs;
  console.log(mailOptions.text);
  console.log("sending mail...");
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent:" + info.response);
    }
  });
};

setInterval(sendMailInterval, 15000);
