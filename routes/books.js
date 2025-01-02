// we are no longer using fs, path which way to store images in the server, we want to save them in the database instead of because whenever the server is restarted, all images are invisible
const express = require('express')
const router = express.Router()
const Book = require('../models/book')
// const fs = require('fs')// remove the books which have error 
const Author = require('../models/author')
/* the function multer() which is going to help us to configure multer in order to be used with our project, the fist thing is "dest" in destination where the upload is 
Then the "dest:" to be some form of upload PATH -> create a PATH in "models/book.js"
the second is "fileFilter" which allows us to actually filter which files our server accepts 
*/
const imageMimeTypes = ['image/jpeg', 'image/png','image/gif']
// const path = require('path')
// const multer = require('multer')
const { coverImageBasePath } = require('../models/book')
// const upload = multer({ 
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => { // the "callback" which we need to call whenever we've done with our actual file filter 
//         callback(null,imageMimeTypes.includes(file.mimetype)) // first params null is no error, the second is boolean (true if file is accepted, False if the file is not accepted)-> create a variable to store acceptedFile - "imageMimeTypes" variable -> then go to route of create book below to add "Cover"
//     }

// })
// All Books Routes
router.get('/', async (req, res)=>{
    // books filter
    let query = Book.find() // query object contains all books OR
    // filter by title
    if(req.query.title != null && req.query.title != '') { // books filter by title
        query = query.regex('title', new RegExp(req.query.title, 'i'))
        /*  In Mongoose, the 'query.regex()' method is used to filter documents in the database by matching a field's value with a regular expression.
        Note: .regex(field, pattern):
            field: The name of the field in the database you want to search (e.g., title in this case).
            pattern: A RegExp object that defines the pattern to search for.

        */
    }
    // filter by Publish Before
    if(req.query.publishedBefore != null && req.query.publishedBefore != '') { // books filter by publishedBefore
        query = query.lte('publishDate', req.query.publishedBefore) // lte: less than equal() function, the key name 'publishDate' must the same key name when we //Create Books Route below
    }
    // filter by Publish After
    if(req.query.publishedAfter != null && req.query.publishedAfter != '') { // books filter by publishedBefore
        query = query.gte('publishDate', req.query.publishedAfter) // gte: greater than equal() function, the key name 'publishDate' must the same key name when we //Create Books Route below
    }
    try {
        const books = await query.exec() // query here is the 'query' object above
        res.render('books/index',{
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Books Route
router.get('/new', async (req, res)=>{
    renderNewPage(res, new Book())
})

// Create Books Route
router.post('/', async (req, res)=>{ // upload.single('cover') is getting a file , after done the "upload" variable -> then add the another params in the middle "upload.single('cover)" means upload the single file name "cover" that must be the same name with the input name of '_form_fields.ejs'
    // const fileName = req.file != null ? req.file.filename : null // retrieve the file name via if "req.file" is not null -> the fileName is "req.file.filename" -> then add this into "new Book({...})"
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), // in "publishDate" we have to write "req.body.publishDate" inside a new Date() function because "req.body.publishDate" will return a String so we need to conver that String into a Date 
        pageCount: req.body.pageCount,
        // coverImageName: fileName, DELETE
        description: req.body.description
        /* Notice that we're not actually putting the cover page image object yet and that's because we first need to 
        create the cover image file on our file system, get the name from that and then save that into our book object 
        -> using libraby "multer" allows us to work multi-part forms which is what a file form is -> in order to do that move to "new.ejs of books" add some code 
        Link: https://www.youtube.com/watch?v=Zi2UwhpooF8&list=PLZlA0Gpn_vH8jbFkBjOuFjhxANC63OmXM&index=10 in "Multipart form"*/
    })
    saveCover(book, req.body.cover)
    try{
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('/books') 
    } catch{ 
        // if(book.coverImageName != null){ // if the book which have the error that we want to delete have the Cover name 
        //     removeBookCover(book.coverImageName) // Create a function the delete that books that correlated to 
        // }
        renderNewPage(res, book, true) // we want to render the new page and pass it in this book variable
    }

})

// we are no longer storing our images on the server we no longer need to worry about removing book covers from unable to uploaded books so DELETE it
// function removeBookCover(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => {
//       if (err) console.error(err)
//     })
// }

async function renderNewPage(res, book, hasError = false) {
    try {
      const authors = await Author.find({})
      const params = {
        authors: authors,
        book: book
      }
      if (hasError) params.errorMessage = 'Error Creating Book'
      res.render('books/new', params)
    } catch {
      res.redirect('/books')
    }
}

function saveCover(book, coverEncoded) {
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded) // "JSON.parse()" is used to convert JSON string into Javascript object
    if(cover != null && imageMimeTypes.includes(cover.type)){
        /* Note: we have to convert 'data' to a Buffer in advance. Ex: const buf = Buffer.from('Hello, World!');
console.log(buf); // Output: <Buffer 48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21> */
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}
module.exports = router