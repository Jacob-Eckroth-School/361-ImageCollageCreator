var express = require('express');


//note that request is deprecated. If someone has a better easier way to send http requests from
//express / node.js servers PLEASE submit a pull request.
const request = require('request');

//app is our server.
var app = express();

//this tells it that we will use public as our default static folder. When receiving a request for a file like "index.html" or "index.js" it will check public/index.js or 
// public/index.html first

//body parser parses JSON bodies into nice javascript objects.
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//loading in ports from an external file so these can be edited easily.
var ports = require('./ports.json');
var catPort = ports.catPort
var dogPort = ports.dogPort

app.listen(dogPort, function () {
    console.log("== Dog Server is listening on port ",dogPort);
});


//this says that if we get a request for a page, first it will look through our
//publicDog/ folder to see if it can find it there. So if it gets a request for index.html
//it will look first to see if it's in there, and if it is just send it.
app.use(express.static('publicDog'));


app.get('/giveMeADog', function (req, res) {

    //I want a cat
   
    sendBody = {}
    sendBody.msg = "This is a message from the dog server";
    sendbody = JSON.stringify(sendBody);
    res.status(200).send(sendBody);
   
})

app.get('/giveMeACat',function(req,res){
    var url = 'http://localhost:' + String(catPort) + '/giveMeACat';
    request(url, { json: true }, (err, response, body) => {
        if (err) { return console.log(err); }
        console.log("got this from the other server")
        console.log(body);

        //since the body is already in JSON, we can just send it along without changing anything.
        //that's the beauty of "REST" or whatever this is. 
        res.status(200).send(body);
      });

})



//if we get here, then none of the above gets have worked, so we send this. You could also send a nice 404 page.
app.get('*', function (req, res) {
    res.status(404);
    res.send("The page you requested doesn't exist");
});