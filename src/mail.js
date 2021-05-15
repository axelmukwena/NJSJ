const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'elkarloshunkbloodz@gmail.com',
        pass: '0816701534'
    }
})

var mailOptions = {
    from: 'elkarloshunkbloodz@gmail.com',
    to: 'sibalatanics@outlook.com',
    subject: 'Sending Email using node.js',
    text: 'Hello world',
    attachments: [
        {
            filename: 'article.pdf',
            content
        }
    ]
}

transporter.sendMail(mailOptions, (error, info) => {
    if(error) console.log(error)
    else console.log('Email sent:' + info.response)
})