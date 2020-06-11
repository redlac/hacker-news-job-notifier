var http = require('http');
var nodemailer = require('nodemailer');

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World');
}).listen(8080);

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
})

let mailOptions = {
    from: '',
    to: '',
    subject: "Latest 'Ask HN: Who's Hiring?' Post",
    text: link
}

do
transporter.sendMail(mailOptions, (error, info){
    if (error){
        console.log(error)
    } else{
        console.log('Email sent:' + info.response);
    }
});

let link;