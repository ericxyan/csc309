var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentsSchema = new Schema({
	"ProjectId": {type: Schema.ObjectId, ref: 'Project'},
	"UserId": {type: Schema.ObjectId, ref: 'User'},
	"Time": {type: Date},
	"Content": {type: String}
});

var Comment = mongoose.model('Comment', commentsSchema, "Comment");
module.exports = Comment;