var mysql = require('./mysql');
var ejs = require("ejs");
var express = require('express');

exports.insertPendingConnection = function(req,res){

	var to_userid = req.param("userid");
	var from_userid = req.session.userid;
	console.log(to_userid);
	console.log(from_userid);
	var insertPendingConnection = "insert into connection(from_user_id, to_user_id, status) values('"+from_userid+"', '"+to_userid+"', 'pending')";

	mysql.dbcall(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.render('connectUser', function(err, result){
				if(!err){
					res.send({"connectUser":"Success"});
				}
				else{
					 res.end('An error occurred');
		             console.log(err);
				}
			});
		}  
	},insertPendingConnection);
}

exports.invitation = function(req, res){
	if(!req.session.userid)
	{
		res.render('index', { title: 'LinkedIn' });
		res.end();
	}
var userid = req.session.userid;
var getConnStat = "select * from users where user_id in (select from_user_id from connection where status='pending' and to_user_id='"+userid+"')";
mysql.dbcall(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){

					console.log("User data fetched");
					console.log(results);
					var firstname = [];
					var lastname = [];
					var emailid = [];
					var userid = [];
					for(var i=0; i<results.length;i++){
						userid[i] = results[i].user_id;
						firstname[i] = results[i].first_name;
						lastname[i] = results[i].last_name;
						emailid[i] = results[i].email_id;
					}
					
					res.render('connectedUser', {userid: userid, firstname: firstname, lastname: lastname, emailid: emailid}, function(err, result){
						if(!err){
							res.end(result);
						}
						else{
							 res.end('An error occurred');
				             console.log(err);
						}
					});
				}
				else {    
						var name = req.session.firstname;
						console.log("Firstname:"+firstname);
						var showConnections = "select first_name from users where user_id in (select from_user_id from connection where status='accepted' and to_user_id="+req.session.userid+");"
						console.log("Query is:" + showConnections);
						mysql.dbcall(function(err,results){
							if(err){
								throw err;
							}
							else 
							{
								var first_name = [];
								
								for(var i=0; i<results.length;i++){
									first_name[i] = results[i].first_name;
									}
								console.log("Connections Results:" + firstname);
								
								res.render('connectionError',{firstname: first_name, name: name},function(err,result){
									if(!err)
									{
										res.end(result);
									}
									else{
										 res.end('An error occurred');
									     console.log(err);
									}
								})
							}  
					},showConnections);
					}
		}
										
	},getConnStat);

}

exports.connect = function(req,res){
	if(!req.session.userid)
	{
		res.render('index', { title: 'LinkedIn' });
		res.end();
	}
	var userid = req.session.userid;
var getUser="select * from users where user_id NOT IN('"+req.session.userid+"')";

	mysql.dbcall(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
				
				if(results.length > 0){

					var firstname = [];
					var lastname = [];
					var emailid = [];
					var userid = [];
					for(var i=0; i<results.length;i++){
						userid[i] = results[i].user_id;
						firstname[i] = results[i].first_name;
						lastname[i] = results[i].last_name;
						emailid[i] = results[i].email_id;
					}
					 
					res.render('connect', {userid: userid, firstname: firstname, lastname: lastname, emailid: emailid}, function(err, result){
						if(!err){
							res.end(result);
						}
						else{
							 res.end('An error occurred');
				             console.log(err);
						}
					});
				}
				else {    
					
					console.log("Cannot fetch user data");
				}
			
		}  
	},getUser);
}

exports.updateStatus = function(req, res){
	var updateStatus = "update connection set status = 'accepted' where to_user_id='"+req.session.userid+"' and from_user_id='"+req.param("userid")+"'";
	console.log("Query is:" + updateStatus);
	mysql.dbcall(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send({"InvitationAccepted":"Success"});
		}  
	},updateStatus);	
}

exports.hello = function(req, res){
  res.render('connectUser');
};
