

var express = require("express");
var app = express();
var io = require("socket.io");

var port = 8080;


io = io.listen(app.listen(port));

var users = {};

function getUsers(obj){
	var tmp = [];
	for (var i in obj){
		tmp.push(obj[i]);
	}
		return tmp.join(", ")
};


/*--------jade settings----------------*/
app.set("views", __dirname + "/tpl");
app.set("view engine", "jade");
app.engine("jade", require("jade").__express); //initializing jade engine
app.use(express.static(__dirname + '/public')); //static place is in public

/*------------get server request-------------------*/
app.get("/", (req, res)=>{
	res.render("page"); //rendering of the page using jade templates from "tpl/page.jade
});

io.sockets.on("connection",(client)=>{
	client.on("send", function(data){
		io.sockets.emit("message", {message:data.message})
	});
	client.on("hello", function(data){
		client.set("nickname", data.name);
		client.emit("message", {message:"Welocome to our chat, " + data.name});
		client.broadcast.emit("message", {message:"-----------" + data.name + " has joined to chat"});


		if (Object.keys(users).length > 0){
			var userList = getUsers(users);
			client.emit("message", {message:"In chat: " + userList + "-----"})
		} else {
			client.emit("message", {message:"You are alone in chat :("})
		};

		users[client.id] = data.name;
	});
	client.on("disconnect", function(data){
		if (Object.keys(users).length > 1){
			client.get("nickname", function(err, name){
				client.broadcast.emit("message", {message: "--------- " + name + " has left the chat"})
			});
		}
		delete users[client.id];
	})
});

