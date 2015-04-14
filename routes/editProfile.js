var mysql = require('./mysql');
var ejs = require("ejs");
var express = require('express');

exports.viewSkills = function(req, res){
 	console.log("Skills in request param"+req.param('skills'));
 	if(req.param('skills') === undefined)
 	{
 		console.log("Nothing changed");
 		res.send("nothing changed");
 	}
 	else
 	{
 		userid = req.session.userid;
  		
  		var saveSkills = "update skills set skillset='"+req.param("skills")+"' where user_id='"+userid+"'";
		
		console.log("Query is:" + saveSkills);
		
		mysql.dbcall(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				console.log("Skills Saved Successfully");
				res.send({"save":"Success"});
			}  
		},saveSkills);
	}
}

exports.viewSummary = function(req, res){
 	console.log(req.body);
 	if(req.param('firstname') === undefined && req.param('lastname') === undefined
 	&& req.param('email') === undefined &&req.param('userSummary') === undefined )
 	{
 		console.log("Nothing changed");
 		res.send("nothing changed");
 	}
 	else
 	{
 		userid = req.session.userid;
  	
  		var saveSummary = "update users set";

		if(req.param('userSummary'))
			{
			  saveSummary = saveSummary + " " + "summary='"+req.param("userSummary")+"',";
			}
		if(req.param('firstname'))
			{
			  saveSummary = saveSummary + " " + "first_name='"+req.param("firstname")+"',";
			}
		if(req.param('lastname'))
			{
			  saveSummary = saveSummary + " " + "last_name='"+req.param("lastname")+"',";
			}
		if(req.param('email'))
			{
			  saveSummary = saveSummary + " " + "last_name='"+req.param("email")+"',";
			}
		saveSummary = saveSummary.substring(0, saveSummary.length-1);
		saveSummary = saveSummary + " " + "where user_id='"+userid+"'";
		console.log("Query is:" + saveSummary);
		
		mysql.dbcall(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				console.log("Save Successfull for user");
				res.send({"save":"Success"});
			}  
		},saveSummary);
	}
}
		
exports.viewExperience = function(req, res){
	console.log(req.body);
 	if(req.param('companyName') === undefined && req.param('title') === undefined &&
 	req.param('location') === undefined && req.param('startdate') === undefined &&
 	req.param('enddate') === undefined && req.param('description') === undefined)
 	{
 		console.log("Nothing changed");
 		res.send("nothing changed");
 	}
 	else
 	{
 		userid = req.session.userid;

  		var saveExperience = "update experience set";
		/*          Experience            */
		if(req.param('companyName'))
			{
			  saveExperience = saveExperience + " " + "company_name='"+req.param("companyName")+"',";
			}
		if(req.param('title'))
			{
			  saveExperience = saveExperience + " " + "title='"+req.param("title")+"',";
			}
		if(req.param('location'))
			{
			  saveExperience = saveExperience + " " + "location='"+req.param("location")+"',";
			}
		if(req.param('startdate'))
			{
			  saveExperience = saveExperience + " " + "start_date='"+req.param("startdate")+"',";
			}
		if(req.param('enddate'))
			{
			  saveExperience = saveExperience + " " + "end_date='"+req.param("enddate")+"',";
			}
		if(req.param('description'))
			{
			  saveExperience = saveExperience + " " + "description='"+req.param("description")+"',";
			}
		
		saveExperience = saveExperience.substring(0, saveExperience.length-1);
		saveExperience = saveExperience + " " + "where user_id='"+userid+"'";
		console.log("Query is:" + saveExperience);
		
		mysql.dbcall(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				console.log("Save Successfull for Experience");
					res.send({"save":"Success"});
			}  
		},saveExperience);
	}
}


exports.viewEducation = function(req, res){
 	console.log(req.body);
 	if( req.param('school') === undefined && req.param('field') === undefined &&
 	req.param('grade') === undefined && req.param('dp') === undefined &&
 	req.param('startdate') === undefined && req.param('enddate') === undefined &&
 	req.param('level') === undefined  )
 	{
 		console.log("Nothing changed");
 		res.send("nothing changed");
 	}
 	else
 	{
 		userid = req.session.userid;

  		var saveEducation = "update education set";  

		if(req.param('school'))
			{
			  saveEducation = saveEducation + " " + "univ_name='"+req.param("school")+"',";
			}
		if(req.param('field'))
			{
			  saveEducation = saveEducation + " " + "field='"+req.param("field")+"',";
			}
		if(req.param('grade'))
			{
			  saveEducation = saveEducation + " " + "grade='"+req.param("grade")+"',";
			}
		if(req.param('dp'))
			{
			  saveEducation = saveEducation + " " + "description='"+req.param("dp")+"',";
			}
		if(req.param('startdate'))
			{
			  saveEducation = saveEducation + " " + "start_date='"+req.param("startdate")+"',";
			}
		if(req.param('enddate'))
			{
			  saveEducation = saveEducation + " " + "end_date='"+req.param("enddate")+"',";
			}
		if(req.param('level'))
			{
			  saveEducation = saveEducation + " " + "level='"+req.param("level")+"',";
			}
		saveEducation = saveEducation.substring(0, saveEducation.length-1);
		saveEducation = saveEducation + "where user_id='"+userid+"'";
		console.log("Query is:" + saveEducation);

		mysql.dbcall(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				console.log("Save Successfull for Education");
					res.send({"save":"Success"});
			}  
		},saveEducation);
	}
}

