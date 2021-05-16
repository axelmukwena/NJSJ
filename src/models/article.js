const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,'The title for the article is required'],
        trim: true
    },
    abstract: {
        type: String
    },
    author: {
        type: String,
        required: [true, 'Author is required']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    publishedDate: {
        type: String
    },
    file: {
        type: Buffer
    },
    volume: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'volumes'
    },
    feature: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

articleSchema.methods.toJSON = function(){
    const articleObject = this.toObject()

    delete articleObject.file

    return articleObject
}

articleSchema.index({title: "text", author: "text"})

const articles = mongoose.model('articles',articleSchema)

module.exports = {
    articles
}