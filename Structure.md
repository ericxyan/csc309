## Project Structure
We are using MEAN stack to build this project.
- Design Pattern: MVC.
- MongoDB: Database
- Express.js: Controller, Driver
- Angular.js: Controller, Template
- Node.js: Server
- Bootstrap: Style
- Library: mongoose.js, passport.js

## REST API Design
### Project
- GET/api/projects 
 - Get all projects.
 - Outpu:
 ````
 {
	{	
		"projectID": ,
		"start_time": ,
		"finish_time": ,
		"status": ,
		"admin": ,
		"members": [user_id1, user_id2,...]
	},
	{
	 project2
	},
	{
	 project3
	},
	...
 }
 ````
- POST/api/projects
 - Create a new projects.
- GET/api/projects/<project_id>
 - Get a single project.
 - Output:
 ````
 	{	
 		"projectID": ,
		"start_time": ,
		"finish_time": ,
		"status": ,
		"admin": ,
		"members": [user_id1, user_id2,...]
	}
````
- PUT/api/projects/<project_id>
 - Update a single project.
- DELETE/api/projects/<project_id>
 - Delete a single project.

### User
- GET/api/users
 - Get all users.
 - Output:
````
	{
		{
			"userid": ,
			"password": ,
			"email": ,
			"cell": ,
			"projects": [project_id_1, project_id_2, ...],
			"skills": 
		},
		{
			"userid": ,
			"password": ,
			"email": ,
			"cell": ,
			"projects": [project_id_1, project_id_2, ...],
			"skills": 
		},
		...

	}
````
- GET/api/users/<user_id>
 - Get a single user.
 - Output:
 ````
	{
		"userId": ,
		"password": ,
		"email": ,
		"cell": ,
		"projects": [project_id_1, project_id_2, ...],
		"skills": 
	}
````
- PUT/api/users/<user_id>
 - Update a single user.

### Rate
- GET/api/rates/<user_id>
 - Get all rates of a single user.
 - Output:
 ````
	{
		{
			"raterID": ,
			"stars": ,
			"comments":  
		},
		{
			"raterID": ,
			"stars": ,
			"comments":  
		},
		...
	}

 ````
- PUT/api/rates/<user_id>
 - Create a rate to a single user.
- POST/api/rates/<user_id>
 - Update a rate to a single user.
- DELETE/api/rates/<user_id>
 - Delete a rate ot a single user.

### Comment
- GET/api/comments/<project_id>
 - Get all comments of a single project.
 - Output:
 ````
	{
		{
			"userId": ,
			"time": ,
			"cotent": 
		},
		{
			"userId": ,
			"time": ,
			"cotent": 
		},
		...
	}
 ````
- PUT/api/comments/<project_id>
 - Add a comment to a project.
- DELETE/api/comments/<project_id>&<comment_id>
 - Delete a comment of a project.
- POST/api/comments/<project_id>&<comment_id>
 - Update a comment of a project.

## DB
comments: {projectId, userId, time, content}