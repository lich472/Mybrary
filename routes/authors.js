const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')


// All Authors Routes
router.get('/', async (req, res)=>{
    // Search Option: 
    let searchOptions = {} // empty object
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i') // create a new Regular Expression with 'i' means case insensitive with search 'ky' -> 'Kyle'
    }
    //
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query // the last thing we want to do is send back the request to the user so that it'll repopulate these fields for them
            }) 
    } catch{
        res.redirect('/')
    }
})

// New Authors Route
router.get('/new', (req, res)=>{
    res.render('authors/new', {author: new Author() })
})

// Create Author Route
router.post('/', async (req, res)=>{
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch(err){
        res.render('authors/new',{
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

/* Because the browser only make GET and POST request so we have no way from the browser to say PUT or DELETE so we need to install a library - "method-override" to allow us to make these PUT and DELETE request 
*/

// Show the authors
router.get('/:id', async (req, res)=>{
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author: author.id}).limit(6).exec()
        res.render('authors/show', {// create those variable hooked up with show.ejs
            author: author,
            bookByAuthor: books
        })
    }catch{
        res.redirect('/')
    }
})

// Edit page for Authors
router.get('/:id/edit', async (req, res)=>{
    try{
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author })
    } catch{
        res.redirect('/authors')
    }
})

//Update route
router.put('/:id',async (req, res)=>{
    let author
    try {
        author = await Author.findById(req.params.id)
        //edit author name
        author.name = req.body.name

        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch(err){ // there are 2 cases: 1. author is null and 2. we can't save author
        if(author == null) {
            res.redirect('/')
        }else{
            res.render('authors/edit',{
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }
})

// Delete Author
router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        if (author == null) {
            return res.redirect('/authors')
        }

        await author.deleteOne() // Use `deleteOne()` to trigger the `pre('deleteOne')` middleware
        res.redirect('/authors')
    } catch (err) {
        console.error(err.message) // Log the error for debugging
        res.redirect(`/authors/${req.params.id}`)
    }
})



module.exports = router