var mongoose = require('./node_modules/mongoose');
var Schema = mongoose.Schema;

var commentsSchema = new Schema({
	"ProjectId": {type: Schema.ObjectId, ref: 'Project'},
	"UserId": {type: Schema.ObjectId, ref: 'User'},
	"Time": {type: Date},
	"Content": {type: String}
});

mongoose.model('Comment', commentsSchema);