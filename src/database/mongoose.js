const mongoose = require('mongoose')

mongoose.connect('mongodb://hostman:b9982a76@143.110.157.177:27017',{
    useNewUrlParser: true,
    useCreateIndex: true
})