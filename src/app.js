const express = require('express')
const path = require('path')
const hbs = require('hbs')
const cookieParser = require('cookie-parser')
const userRoute = require('./routers/user')
const volumeRoute = require('./routers/volume')
const articlesRoute = require('./routers/article')
const mongoose = require('./database/mongoose')
const {volumes} = require('./models/volume')
const {articles} = require('./models/article')
const auth = require('../src/middleware/auth')

const publicPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')
const scriptPath = path.join(__dirname,'../src/js')
const app = express()

app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use('/js',express.static(scriptPath))
app.use(cookieParser())
hbs.registerPartials(partialsPath)

app.use(express.static(publicPath))

app.use(express.json())
app.use(userRoute)
app.use(volumeRoute)
app.use(articlesRoute)

app.get('',(req, res) => {
    res.render('index')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/volume/:id', (req, res) => {
    res.render('volume',{
        "volume": req.params.id
    })
})
app.get('/guidelines',(req, res)=> {
    res.render('guidelines')
})
app.get('/submission/:id', auth,(req, res)=> {
    res.render('submission',{
        volume: req.params.id
    })
})
app.get('/submission', auth,(req, res)=> {
    res.render('submission',{
        volume: req.params.id
    })
})
app.get('/search', async (req, res)=>{
    const query = {$text: {$search: req.query.term}}
    const articleAll = await articles.find(query)

    if(!articleAll) {
        res.render('search',{result: "none"})
    }
    res.render('search', {result: req.query.term})
})

app.get('/search/:term', async (req, res)=>{
    const query = {$text: {$search: req.params.term}}
    const articleAll = await articles.find(query)

    res.send(articleAll)
})
app.get('/contact', auth,(req, res)=> {
    res.render('contact')
})
module.exports = app