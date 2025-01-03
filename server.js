require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
// Set up method-override lib
const methodOverride = require('method-override')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

app.set('view engine','ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
// then we want to tell our app to use that method-override
app.use(methodOverride('_method'))
app.use(express.static('public'))
// body-parser. Note: should be applied before the route definitions (app.use('/', indexRouter) and app.use('/authors', authorRouter)).
app.use(express.json())
app.use(express.urlencoded({limit: '10mb', extended: false})) // limit means we limits the uploaded files is 10mb

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)


db.on('err', err => console.err(err))
db.once('open', () => console.log('Database Connected'))


app.listen(3011, ()=>console.log('Server Started'))