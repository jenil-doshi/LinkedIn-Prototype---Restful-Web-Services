var mysql = require('./mysql');
var ejs = require("ejs");
var express = require('express');


exports.createProfile = function(req,res){
	if(!req.session.userid)
	{
		res.render('index', { title: 'LinkedIn' });
		res.end();
	}
	res.render('createProfile', function(err, result){
		if(!err){
			res.end(result);
		}
		else{
			 res.end('An error occurred');
             console.log(err);
		}
	});
}

exports.saveSummary = function(req, res){
	userid = req.session.userid;
   var saveSummary="update users set summary='"+req.param("userSummary")+"' where user_id='"+userid+"';";
	console.log("Query is:"+saveSummary);
	 
	mysql.dbcall(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
				console.log("Summary Saved");
				res.send({"save":"Success"});
		}  
	},saveSummary);
};

exports.saveExperience = function(req, res){
	userid = req.session.userid;
	var expData = {};
	data = req.param("expData");
	var count = Object.keys(data).length;
	var i = 0;
	for(var key in data){
		
		console.log("Company Name="+data[key].companyName);
		var saveExperience="insert into experience(company_name, title, location, description, end_date, start_date, user_id) values('"+data[key].companyName+"','"+data[key].title+"','"+data[key].location+"','"+data[key].description+"','"+data[key].enddate+"','"+data[key].startdate+"', '"+userid+"')";
	

	 console.log("Query is:"+saveExperience);
	 
	mysql.dbcall(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(i == count){
				console.log("Experience Saved");
				res.send({"save":"Success"});
			}
		}  
	},saveExperience);
	i++;
	}
};

exports.saveEducation = function(req, res){
	userid = req.session.userid;
	var eduData = {};
	data = req.param("eduData");
	var count = Object.keys(data).length;
	var i=0;
	for(var key in data){
		
		var saveEducation="insert into education(level, univ_name, field, grade, description, end_date, start_date, user_id) values('"+data[key].level+"','"+data[key].school+"','"+data[key].field+"','"+data[key].grade+"','"+data[key].dp+"','"+data[key].enddate1+"','"+data[key].startdate1+"', '"+userid+"')";
	

	 console.log("Query is:"+saveEducation);
	 
	mysql.dbcall(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(i == count){
				console.log("Education Saved");
				res.send({"save":"Success"});
			}
		}  
	},saveEducation);
	}
};

exports.saveSkill = function(req, res){
	userid = req.session.userid;
	var skills = req.param("skills");
	var skill = JSON.stringify(skills);
	console.log(skills[0].text);
	for(var i=0; i<skills.length; i++)
	{
   		var saveSkill="insert into skills(skillset, user_id) values('"+skills[i].text+"','"+userid+"')";
	
	console.log("Query is:"+saveSkill);
	 
	mysql.dbcall(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
				console.log("Skill Saved");
				res.send({"save":"Success"});
		}  
	},saveSkill);
}
};

exports.viewProfile = function(req,res){
	if(!req.session.userid)
	{
		res.render('index', { title: 'LinkedIn' });
		res.end();
	}
	userid = req.session.userid;
	//console.log("Before:"+JSON.stringify(res));
	var userDetails="select * from users where user_id='"+userid+"'";
	var userExperience="select * from experience where user_id='"+userid+"'";
	var userEducation="select * from education where user_id='"+userid+"'";
	var userSkills="select * from skills where user_id='"+userid+"'";
	console.log("Query is:"+userDetails);
	console.log("Query is:"+userExperience);
	console.log("Query is:"+userEducation);
	console.log("Query is:"+userSkills);
	
	mysql.dbcall(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log(JSON.stringify(results));
			if(results.length > 0){
				var summary = [];
				summary = results;
			}
			else
			{
				summary = '';
			}

			mysql.dbcall(function(err,results){
				if(err){
					throw err;
				}
				else 
				{		
						if(results.length > 0){
							var experience = [];
							experience = results;
							console.log("Experience:" + experience);
						}
						else{
							experience = '';
						}
						
						mysql.dbcall(function(err,results){
							if(err){
								throw err;
							}
							else 
							{
								if(results.length > 0)
								{
									var education = [];
									education = results;
								}
								else
								{
									education = '';
								}
								mysql.dbcall(function(err,results){
									if(err){throw err;}
									else{
										var skills = [];
										for(var i=0; i< results.length; i++){
																				
										if(results.length > 0)
										{
											skills[i] = results[i].skillset;
										}
										}
										//console.log("After:"+skills);

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
								}, userSkills);
							}  
						},userEducation);
				}  
			},userExperience);
		}  
	},userDetails);

	
}
