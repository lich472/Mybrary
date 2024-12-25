const mongoose = require('mongoose')

const librarianSchema = new mongoose.Schema({
    name: {
        type: String,
        password: String,
        required: true
    }
})

module.exports = mongoose.model("Librarian", librarianSchema)