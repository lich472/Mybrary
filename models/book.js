const mongoose = require('mongoose')
const path = require('path')

// where all of our cover images are going to be stored -> then export the varible 
const coverImageBasePath = 'uploads/bookCovers' // the path which gonna be inside of our "public" folder 

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

bookSchema.virtual('coverImagePath').get(function() { // to fix the TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received undefined
    if (this.coverImageName != null) {
      return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model("Book", bookSchema)
// export the "coverImageBasePath" variable name -> then come back "routes/books" inside the "upload" variable
module.exports.coverImageBasePath = coverImageBasePath