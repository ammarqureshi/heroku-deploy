var express = require('express');

var app = express();


//set port
//env = environment
//either set to to port heroku sets for us or if it can then we will be at port 5000
var port = process.env.PORT || 5000

//allows us to server static files
app.use(express.static(__dirname));


//set up routes

//server code set up
app.get("/", function(req, res){
    res.render("index");
})

//server listens for request and sends a response to each request.


app.listen(port, function(){
    
    console.log("app running");
})