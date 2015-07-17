var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ratingSchema = new Schema({
	"RaterId": {type: Schema.ObjectId, ref: 'User'},
	"Stars": {type: Number},
	"Comments": {type: String}
});

var Rating = mongoose.model('Rating', ratingSchema, "Rating");
module.exports = Rating;