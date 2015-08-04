var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
	"UserId": {type: String},
	"Pwd": {type: String},
	"NickName": {type: String},  // add NickName
	"Email": {type: String}, 
	"Ceil": {type: String},
	"Skills": [{type: String}],
	"Rating": [{type: Schema.ObjectId, ref:'Rating'}],
	"AvgRating": {type: Number, default: 0}
});

var User = mongoose.model('User', usersSchema, 'User');
module.exports = User;