const mongoose = require('mongoose')
/* We cant delete the author who has the book because if wwe delete the author, all the books associated will be deleted too
Step1: require the book model
Step2: in mongoose there is a function .pre() 
*/
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

//Step2:..
authorSchema.pre('deleteOne', { document: true, query: false }, async function (next) { // Correct Middleware Hook: To trigger the middleware with deleteOne, you must set { document: true, query: false } in the middleware options.
    try {
        const books = await Book.find({ author: this.id }) // `this` refers to the document being deleted
        if (books.length > 0) {
            next(new Error('This author has books still')) // Block the deletion
        } else {
            next() // Proceed with the deletion
        }
    } catch (err) {
        next(err) // Pass errors to the next middleware
    }
})



module.exports = mongoose.model("Author", authorSchema)