var mongoose = require('./mongoose');
var Schema = mongoose.Schema;

var ratingSchema = new Schema({
	RaterId: {type: Schema.ObjectId, ref: 'User'},
	Stars: {type: int},
	Comments: {type: String}
});

mongoose.model('Rating', ratingSchema);