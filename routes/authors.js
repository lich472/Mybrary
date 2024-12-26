const express = require('express')
const router = express.Router()
const Author = require('../models/author')

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
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect('/authors')
    } catch(err){
        res.render('authors/new',{
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

module.exports = router