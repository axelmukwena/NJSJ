const mongoose = require('mongoose')

const volumeSchema = new mongoose.Schema({
    issue: {
        type: Number,
        unique: [true, 'Volume already exists']
    },
    name: {
        type: String,
        unique: [true,'Volume already exists']
    },
    title: {
        type: String,
        required: true
    },
    abstract: {
        type: String
    },
    publishedDate: {
        type: String,
        required: [true, 'The date the volume was published is required'],
        trim: true
    },
    cover: {
        type: Buffer
    }
},{
    timestamps: true
})

// Link to articles 
volumeSchema.virtual('articles',{
    ref: 'articles',
    localField: '_id',
    foreignField: 'volume'
})

// Create volume name
volumeSchema.pre('save', async function (next){
    if(this.isModified('issue')){
        this.name = 'Vol. '+this.issue
    }
    next()
})

volumeSchema.methods.toJSON = function(){
    const volumeObject = this.toObject()

    delete volumeObject.cover

    return volumeObject
}

const volumes = mongoose.model('Volumes', volumeSchema)

module.exports = {
    volumes
}