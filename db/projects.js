var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectsSchema = new Schema({
	"ProjectName": {type: String}, // we missed this in phase 2.
	"Description": {type: String},
	"Subjects": [{type: String}],
	"Start_time": {type: Date, default: Date.now},
	"Finish_time": {type: Date, default: null},
	"Status": {type: Number},
	"Admin": {type: Schema.ObjectId, ref: 'User'},
	"Member": [{type: Schema.ObjectId, ref: 'User'}],
	"Candidate": [{type: Schema.ObjectId, ref: 'User'}]
});

var Project = mongoose.model('Project', projectsSchema, "Project");
module.exports = Project;