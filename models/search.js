const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SearchSchema = new Schema({
  imageURL: String,
  description: String,
  pageURL: String

});

var Search = mongoose.model('Search',SearchSchema);
module.exports = Search;
