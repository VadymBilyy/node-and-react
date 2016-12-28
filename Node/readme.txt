1. node app.js
2. node server.js
3. access to localhost:8080/user/(john, mike, ivan or any)
4. will make request to localhost:8081/?name=(john, mike, ivan or any)
5. server will separate name from query string
6. will response with data to app.js, based on entry name parametr
7. app.js will parse the JSON format and render the answer with ejs template (user.ejs)
