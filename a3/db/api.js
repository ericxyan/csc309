// import database schemas.
var mongoose = require('mongoose');
require('projects.js');
require('rating.js');
require('comments.js');
require('user.js');

/*
NOTE:   Didn't add callbacks for all apis
*/

/* ---------- general apis ---------- */

/*
Return the number of entries in the table
*/
function countEntries(table){
	return mongoose.model(table).find().length
}


/* ---------- apis for user ---------- */

/* 
query the user's info by userId and pwd, 
return the JSON iff the user is valid. Otherwise return null.
 */
function checkLogin(userId, pwd){
	return mongoose.model('User').findOne({UserId : userId, pwd : pwd});
}

/*
Return the updated version of userJSON
*/
function updateUsersInfo(userJSON){
	return mongoose.model('User').findOneAndUpdate({_id : userJSON._Id}, userJSON);
}
function getUserInfo(objectId){
	return mongoose.model('User').findone({_id: objectId});
}

/* ---------- apis for projecets ---------- */

/*
get project JSON by given projectId
*/

function getProject(projectId){
	return mongoose.model('Project').findOne({"_id" : projectId});
}

/*
get list of project JSON by given sortBy and condtion
*/
function getProjects(sortBy, condition){
	var temp;
	if(condition){
		temp = mongoose.model('Project').find(condition);
	} else {
		temp = mongoose.model('Project').find();
	}
	return temp.sort(sortBy, -1);
}

/*
Return the boolean shows that if the insertion is done properly.
*/
function addNewProject(projectJSON){
	return new mongoose.model('Project')(projectJSON).save(function(err, doc){
		if(err){ 
			return false;
		}
		else { // update projectId to users info
			var userJSON = getUserInfo(projectJSON.Admin);
			userJSON.Projects.push(doc._id);
			updateUsersInfo(userJSON);
			return true;
		}
	});
}

/*
Update the project JSON, return the updated JSON
*/
function updateProject(projectJSON){
	return mongoose.model('Project').findOneAndUpdate({_id: projectJSON._id}, projectJSON);
}

/*
Delete the project with given projectId. Return true if succuss
*/

function deleteProject(projectId){

}
