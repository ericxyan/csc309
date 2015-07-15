var mongoose = require('./mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
	UserId: {type: String},
	Pwd: {type: String},
	Email: {type: String},
	Ceil: {type: String},
	Projects: [{type: Schema.ObjectId, ref: 'Project'}],
	Skills: [{type: String}],
	Rating: [{type: Schema.ObjectId, ref:'Rating'}]
});

mongoose.model('User', usersSchema);