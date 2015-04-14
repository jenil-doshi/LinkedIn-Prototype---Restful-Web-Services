var mysql = require('./mysql');
var ejs = require("ejs");
var express = require('express');

exports.displaySearch = function(req,res){
	var text = req.param("srch");

	var searchUser = "select * from users where first_name like '%"+text+"%'";
	mysql.dbcall(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			var searchResults = JSON.stringify(results);
			console.log(searchResults);
				if(results.length > 0)
				{
					console.log("inside search js");
					
					res.render('connectUser',{results:results});
					res.end();
					
				}  
				else
				{
					alert("Nothing to return");
				}
		}
	},searchUser);
	
}


exports.saveImage = function(req,res)
{
	console.log(req);
	//var img=req.param("img");
	var image=req.body.image;
	var uid=req.session.userid;
	
	var imgQuery="update linkedin.users set image='"+image+"' where user_id="+uid;
	
	console.log("query for image is: "+imgQuery);
	
	mysql.dbcall(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("image Saved Successfully");
			res.send({"save":"Success"});
		}  
	},imgQuery);
	
	
};

exports.signout = function(req, res){
	var dt=Date().toString();
	var insertDate="update users set date='"+dt+"' where user_id='"+req.session.userid+"'";
	console.log("Quesry for date is:"+ insertDate);
 	mysql.dbcall(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("Date Updated");
		}  
	},insertDate);
    req.session.destroy(function(err) {
           
           if(!err){
                res.render('index', { title: 'LinkedIn' }, function(err, result) {
			        // render on success
			        if (!err) {
			        	console.log("Session Destroyed");
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
    			});
            }else{
                
                res.send('error');
                res.end();
            }
        });
}
exports.signin = function(req, res){
	 var getUser="select * from users where email_id='"+req.param("username")+"'";
	console.log("Query is:"+getUser);
	//var dt=Date().toString();

	 var email = req.param("username");
	 req.session.email = email;
	mysql.dbcall(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("valid Login");
				req.session.userid = results[0].user_id;
				req.session.firstname = results[0].first_name;
				console.log(req.session.userid);
				//res.redirect('/successSignIn');
				res.send({"login":"Success"});
			}
			else {    
				
				console.log("Invalid Login");
				res.send({"login":"Fail"});
			}
		}  
	},getUser);
};

exports.signup = function(req, res){
	var getUser="select * from users where email_id='"+req.param("email")+"'";
	var getUserID = "select user_id from users where email_id='"+req.param("email")+"'";
	var insertUser = "insert into linkedin.users(first_name, last_name, email_id, password) values ('"+req.param("firstname")
		+"' , '"+req.param("lastname")
		+"' , '"+req.param("email")
		+"' , '"+req.param("password")+"')";	
	
	console.log("Query is:"+insertUser);
	
	mysql.dbcall(function(err,results){
		
		if(results.length > 0){
			console.log("Registration cannot be done");
			res.send("Already Registered with this ID, enter different email ");
		}
		else 
		{
				mysql.dbcall(function(err,results){
				if(results.length > 0){
					console.log("Registration Fail");
						res.send({"register":"Fail"});
				}
				else 
				{
							mysql.dbcall(function(err,results){
							if(results.length > 0){
								console.log("Results after fetching userid:"+results);
								req.session.userid = results[0].user_id;
								console.log(req.session.userid);
								console.log("Registration Done");
								res.send({"register":"Success"});
							}
							else 
							{
									console.log("Error in While Fetching DB");
							}  
						},getUserID);
					
				}  
			},insertUser);
			
		}  
	},getUser);

	

};

exports.successLogin = function(req,res)
{
	if(!req.session.userid)
	{
		res.render('index', { title: 'LinkedIn' });
		res.end();
	}
	console.log(req.session.email);
	var getSummary="select * from users where user_id='"+req.session.userid+"'";
	var getEducation="select * from education where user_id='"+req.session.userid+"'";
	var getExperience="select * from experience where user_id='"+req.session.userid+"'";
	var getSkills="select * from skills where user_id='"+req.session.userid+"'";
	
	console.log("Query is:"+getSummary);
	console.log("Query is:"+getEducation);
	console.log("Query is:"+getExperience);
	console.log("Query is:"+getSkills);
		
	mysql.dbcall(function(err,results){
		
		if(err){
			throw err;
		}
		if(results.length > 0)
		{
				var summary = [];
				summary = results;

			mysql.dbcall(function(err,results){
		
					if(err){
						throw err;
					}
					if(results.length > 0)
					{
						var education = [];
						education = results;

						mysql.dbcall(function(err,results){
		
							if(err){
								throw err;
							}
							if(results.length > 0)
							{
								var experience = [];
								experience = results;

								mysql.dbcall(function(err,results){
		
									if(err){
										throw err;
									}
									if(results.length > 0)
									{	
										var skills = [];
										for(var i=0; i< results.length; i++){
																									
											if(results.length > 0)
											{
												skills[i] = results[i].skillset;
											}
										}				

										res.render('viewProfile', 
										{
											summary: summary,
											experience : experience,
											education : education,
											skills: skills,
										}, function(err, result){
										if(!err){
											res.end(result);
										}
										else{
										 res.end('An error occurred');
										  console.log(err);
											}
										});

									}
									else
									{
										res.render('createProfile',function(err, result) {
									        // render on success
									        if (!err) {
									        	console.log("Summary Returned");
									            res.end(result);
									        }
									        // render or error
									        else {
									            res.end('An error occurred');
									            console.log(err);
									        }
						    			});

									}
									
								},getSkills);
							}
							else
							{
								res.render('createProfile',function(err, result) {
							        // render on success
							        if (!err) {
							        	console.log("Summary Returned");
							            res.end(result);
							        }
							        // render or error
							        else {
							            res.end('An error occurred');
							            console.log(err);
							        }
				    			});

							}
							
						},getExperience);
					}
					else
					{
						res.render('createProfile',function(err, result) {
					        // render on success
					        if (!err) {
					        	console.log("Summary Returned");
					            res.end(result);
					        }
					        // render or error
					        else {
					            res.end('An error occurred');
					            console.log(err);
					        }
		    			});

					}
					
				},getEducation);
		}
		else
		{
			res.render('createProfile',function(err, result) {
			        // render on success
			        if (!err) {
			        	console.log("Summary Returned");
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
    			});
		}
		
	},getSummary);
}


exports.failLogin = function(req,res)
{
	if(!req.session.userid)
	{
		res.render('index', { title: 'LinkedIn' });
		res.end();
	}
	res.render('failLogin',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}

exports.successRegister = function(req,res)
{
	if(!req.session.userid)
	{
		res.render('index', { title: 'LinkedIn' });
		res.end();
	}
	res.render('successRegister',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}

