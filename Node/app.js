/*--------loading modules------------*/
var express = require("express");
var request = require("request");
var url = require("url");
/*--------------server create----------*/
var app = express();
app.listen(8080, ()=>{console.log("Server is listening 8080")});
/*-------template ejs settings--------------*/
app.set("views", __dirname);
app.set("view engine", "ejs");

/*--------data-----------------*/
var names = {
				"john":"admin", 
				"mike":"manager", 
				"ivan":"user"
			};

/*------get requests--------------*/
app.get("/", (req, res)=>{
	res.sendfile(__dirname+"/index.html");
});



app.get("/user/:name", function(req, res){
	var name = req.params.name;
	var options = {
			protocol:"http",
			host:"localhost:8081",
			pathname:"/",
			query:{user:name}
	};
	//var needUrl = "http://localhost:8081/?name=" + name;
	var needUrl = url.format(options);// create url for request to server.js

	request(needUrl, function(err, response, body){
		//console.log(body, req.url)
		var arr = JSON.parse(body);
		res.render("user", {
			name: arr[0].name,
			age: arr[0].age,
			admin: arr[0].admin
		});
	});
});

/*
app.get("/user/:name", (req, res)=>{
	var role;
	var name = req.params.name.toLowerCase();
	if (name in names){
		role = names[name];
	} else {
		role = "Unknown user";
	}
	res.render("user", {
						name:name,
						role:role
					});
	res.end();
})
*/