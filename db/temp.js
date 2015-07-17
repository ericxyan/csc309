// import database schemas.
var mongoose = require('./node_modules/mongoose');
require('./db/projects.js');
require('./db/rating.js');
require('./db/comments.js');
require('./db/user.js');

var User = mongoose.model("User");
var Project = mongoose.model("Project");
var Rating = mongoose.model("Rating");
var Comment = mongoose.model("Comment");

/*
NOTE:   Didn't add callbacks for all apis
*/

/* ---------- general apis ---------- */

/*
Return the number of entries in the table
*/
var  countEntries = function(table){
	return mongoose.model(table).find().length
}


/* ---------- apis for user ---------- */

/*
query the user's info by userId and pwd,
return the JSON iff the user is valid. Otherwise return null.
 */
var checkLogin = function(userId, pwd){
	return mongoose.model('User').findOne({UserId : userId, pwd : pwd});
}

/*
Return the updated version of userJSON
*/
var updateUsersInfo = function(userJSON){
	return mongoose.model('User').findOneAndUpdate({_id : userJSON._Id}, userJSON);
}

/*
Return the user's information with
*/
var getUserInfo = function(objectId){
	return mongoose.model('User').findOne({_id: objectId});
}

/* ---------- apis for projecets ---------- */

/*
get project JSON by given projectId
*/

var getProject = function(projectId){
	return mongoose.model('Project').findOne({"_id" : projectId});
}

/*
get list of project JSON by given sortBy and condtion
*/
var getProjects = function(sortBy, condition){
	var temp;
	if(condition){
		temp = mongoose.model('Project').find(condition);
	} else {
		temp = mongoose.model('Project').find();
	}
	return temp.sort(sortBy, -1);
}

/*
Save the projectJSON and return the promise object
*/
var addNewProject = function(projectJSON){
	return new Project(projectJSON).save()
}

/*
Update the project JSON, return the updated JSON
*/
var updateProject = function(projectJSON){
	return mongoose.model('Project').findOneAndUpdate({_id: projectJSON._id}, projectJSON);
}

/*
Delete the project with given projectId. Return false iff failed.
*/
var deleteProject = function(projectJSON){
	return mongoose.find(projectJSON).remove() != null;
}

/* ---------- apis for rating ---------- */
var getRating = function(UserJSON) {
	for ratingId in UserJSON.Rating

}


