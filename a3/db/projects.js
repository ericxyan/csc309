var mongoose = require('./node_modules/mongoose');
var Schema = mongoose.Schema;

var projectsSchema = new Schema({
	"ProjectName": {type: String}, // we missed this in phase 2.
	"Description": {type: String},
	"Start_time": {type: Date},
	"Finish_time": {type: Date},
	"Status": {type: String},
	"Admin": {type: Schema.ObjectId, ref: 'User'},
	"Member": [{type: Schema.ObjectId, ref: 'User'}],
	"Comments": [{type: Schema.ObjectId, ref: 'Comment'}]
});

mongoose.model('Project', projectsSchema);