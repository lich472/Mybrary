require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const Librarian = require('./models/librarian')
const indexRouter = require('./routes/index')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

app.set('view engine','ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use('/', indexRouter)

db.on('err', err => console.err(err))
db.once('open', () => console.log('Database Connected'))


app.listen(3011, ()=>console.log('Server Started'))