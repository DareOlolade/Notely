const mongoose = require("mongoose")

const noteSchema = mongoose.Schema({
    title: String,
    body: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
}, {timestamps: true})

const Note = mongoose.model("Note", noteSchema)

module.exports = Note