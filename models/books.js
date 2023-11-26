var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ISBN: String,
    img: Buffer,
    title: String,
    author: String,
    inventory: Number,
    category: String
});

module.exports = mongoose.model('books', BookSchema);
