const mongoose = require('./database/mongoose')
const express = require('express')
const userRoute = require('./routers/user')
const volumeRoute = require('./routers/volume')
const articlesRoute = require('./routers/article')
const path = require('path')
const hbs = require('hbs')
const cookieParser = require('cookie-parser')

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

app.get('', (req, res) => {
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
app.get('/submission',(req, res)=> {
    res.render('submission')
})
module.exports = app