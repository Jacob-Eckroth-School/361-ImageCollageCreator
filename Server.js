var express = require('express');
var fs = require('fs');
//note that request is deprecated. If someone has a better easier way to send http requests from
//express / node.js servers PLEASE submit a pull request.
const request = require('request');

var exphbs = require('express-handlebars');
const path = require('path');

//app is our server.
var app = express();

//this tells it that we will use public as our default static folder. When receiving a request for a file like "index.html" or "index.js" it will check public/index.js or 
// public/index.html first

const MAXLENGTH = 30;

//body parser parses JSON bodies into nice javascript objects.
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//loading in ports from an external file so these can be edited easily.
var ports = require('./ports.json');
const { fstat } = require('fs');
var port = ports.collagePort;

app.listen(port, function () {
    app.set('views', __dirname +'/views');
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        extname:'handlebars',
        layoutsDir:path.join(__dirname,"/views/layouts"),
        partialsDir:[
            path.join(__dirname,"/views/partials")
        ],
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
app.use(express.static(__dirname + '/public'));


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
app.get('/result',function(req,res){
    res.render('resultPage');
})

app.get('/result/:collageTitle',function(req,res){
    res.render('resultPage');
})

const createCollage = require(__dirname + "/createCollage");


app.get('/getCollage/:collageTitle',function(req,res){
  console.log("got request for collage");  
  var fileName = req.params.collageTitle + ".png"
    const pathToFile = __dirname + "/collages/" + fileName;
    if(fs.existsSync(pathToFile)){
        res.sendFile(pathToFile);
    }else{
        var imagesDirectory = require('path').join(__dirname,"images",req.params.collageTitle);
        createCollage.createCollage(req.params.collageTitle,imagesDirectory);
        setTimeout(function(){
            if(fs.existsSync(pathToFile)){
                res.sendFile(pathToFile);
            }else{
                res.status(404).send("can't find the file");
            }
        },1000) //fix this damn it
        
    
    }
    


})

//if we get here, then none of the above gets have worked, so we send this. You could also send a nice 404 page.
app.get('*', function (req, res) {
    res.status(404);
    res.send("The page you requested doesn't exist");
});

app.post('/getCollage',function(req,res){
    var amountOfImages = req.body.imageAmount;
    var title = req.body.collageTitle;
    var dirLocation = __dirname + "/images/"+title
    if (!fs.existsSync(dirLocation)) {
        fs.mkdirSync(dirLocation, 0744);
    }
    var imagesText = req.body.images;
    
    for(var i = 0; i < amountOfImages; i++){
        var matches = imagesText[i].match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        var fileOut = dirLocation + "/" + i + ".png"
        fs.writeFileSync(fileOut,response.data,err=>{
         
            if(err){
                console.log(err);
            }
        })
    }
    res.status(200).send();
})


