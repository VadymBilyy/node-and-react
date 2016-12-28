
//curl http://localhost:8081/?name=ivan
var http = require("http");
var url = require("url");

http.createServer((request,response)=>{
	var data = "";
	var input = url.parse(request.url)
	
	if (input.query){
		var q = input.query.split("=");

		switch (q[1].toLowerCase()){
			
			case "john": 
				data = '[{"name":"John Smith", "age":"25", "admin":"true"}]'; break;
			case "mike": 
				data = '[{"name":"Mike Doe","age":33,"admin":"false"}]'; break;
			default: 
				data = '[{"name":"Unknown user","age":0,"admin":"false"}]'; break;
		}
	}
	response.writeHead(200, {"Content-type":"application/json"});
	response.write(data.toString());
	response.end();
}).listen(8081);