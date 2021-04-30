var express = require('express');

//note that request is deprecated. If someone has a better easier way to send http requests from
//express / node.js servers PLEASE submit a pull request.
const request = require('request');

var exphbs = require('express-handlebars');

//app is our server.
var app = express();

//this tells it that we will use public as our default static folder. When receiving a request for a file like "index.html" or "index.js" it will check public/index.js or 
// public/index.html first

const MAXLENGTH = 30;

//body parser parses JSON bodies into nice javascript objects.
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//loading in ports from an external file so these can be edited easily.
var ports = require('./ports.json');
var port = ports.collagePort;

app.listen(port, function () {
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        helpers: {
            section: function (name, options) {
                if (!this._sections) this._sections = {}
                this._sections[name] = options.fn(this)
                return null
            },
        }
    }));
    app.set('view engine', 'handlebars');
    console.log("==Server is listening on port ",port);
});

//this says that if we get a request for a page, first it will look through our
//publicCat/ folder to see if it can find it there. So if it gets a request for index.html
//it will look first to see if it's in there, and if it is just send it.
app.use(express.static('public'));


app.get('/', function (req, res) {

    res.render('homePage');
   
})



app.get('/uploadImages/:collageTitle',function(req,res,next){
    var userTitle = req.params.collageTitle;
    if(userTitle.length > MAXLENGTH){
        next();
    }else{
        res.render('uploadImages',{
            title:userTitle
        })
    }
    
    

})


//if we get here, then none of the above gets have worked, so we send this. You could also send a nice 404 page.
app.get('*', function (req, res) {
    res.status(404);
    res.send("The page you requested doesn't exist");
});