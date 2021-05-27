const {Router} = require('express')
const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const {volumes} = require('../models/volume')
const {users} = require('../models/user')
const {articles} = require('../models/article')
const auth = require('../middleware/auth')

const router = express.Router()

const jsonParser = bodyParser.json()

const urlencodedParser = bodyParser.urlencoded({extended: false})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'namsocialjustice@gmail.com',
        pass: 'Namsocial@123'
    }
})

// Upload article file
const upload = multer({
    limits: {
        fileSize: 50000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.toLowerCase().match(/\.pdf/)){
            return cb(new Error('Please upload a PDF file'))
        }
        cb(undefined, true)
    }
})

// Add article
router.post('/articles/publish/:id', auth, urlencodedParser,  upload.single('article'),async (req, res)=>{
    try {
        const buffer = req.file.buffer
        const volume = await volumes.findById(req.params.id)

        const article = new articles({
            title: req.body.title,
            abstract: req.body.abstract,
            author: req.body.author,
            publishedDate: volume.publishedDate,
            owner: req.user._id,
            volume: req.params.id,
            feature: req.body.feature === 'Yes',
            file: buffer
        })

        await article.save()
        res.redirect(req.get('referer'))

    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

// download article pdf
router.get('/articles/file/:id', async (req, res)=>{
    try {
        const article = await articles.findById(req.params.id)

        if(!article || !article.file){
            return res.status(404).send()
        }
        res.set('Content-Type', 'application/pdf')
        res.send(article.file)
    } catch (error) {
        res.status(500).send()
    }
})

// get articles for a volume
router.get('/articles/volume/:id', async(req, res)=>{
    const match = {}
    let sort = {}

    if(req.query.feature){
        match.feature = req.query.feature === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        const volume = await volumes.findById(req.params.id)
        
        const limit = parseInt(req.query.limit) || 0
        const skip = parseInt(req.query.skip) || 0
        await volume.populate({
            path: 'articles',
            match,
            options: {
                limit: limit,
                skip: skip,
                sort
            }
        }).execPopulate()
        res.send({
            "volume": volume,
            "articles": volume.articles
        })
        sort = undefined
    } catch (error) {
        res.status(404).send()
        sort = undefined
    }

})

// delete article
router.delete('/article/:id',auth,async (req, res)=>{
    try {
        const article = await articles.findById(req.params.id)

        if(!article) res.status(404).send()
        await article.remove()
        res.send(article)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/articles/submit', urlencodedParser, upload.single('article'), async (req, res)=>{
    try {
        const buffer = req.file.buffer
        const today = Date.now()
        const date = new Date(today)
        const maillist = ['vivaworkers@gmail.com', 'rinaanim@yahoo.com']

        maillist.forEach((to)=>{
            var mailOptions = {
                from: 'namsocialjustice@gamil.com',
                to: to,
                subject: 'Article Submission',
                text: `
                    From: ${req.body.email}
                    Title: ${req.body.title}
                    Author: ${req.body.author}
                    Abstact: ${req.body.abstract}
                    Submission Date: ${date}
                `,
                attachments: [
                    {
                        filename: `${req.body.title}.pdf`,
                        content: buffer,
                        constentType: 'application/pdf'
                    }
                ]
            }
            transporter.sendMail(mailOptions, (error, info)=>{
                if(!error)
                    res.redirect('/submission')
                else
                    console.log(error)
            })
        })
    } catch (error) {
        
    }
})
module.exports = router