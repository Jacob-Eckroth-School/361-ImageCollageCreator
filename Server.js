var express = require('express');

//note that request is deprecated. If someone has a better easier way to send http requests from
//express / node.js servers PLEASE submit a pull request.
const request = require('request');

var exphbs = require('express-handlebars');
var path = require('path');

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
app.get('/result',function(req,res){
    res.render('resultPage');
})



//if we get here, then none of the above gets have worked, so we send this. You could also send a nice 404 page.
app.get('*', function (req, res) {
    res.status(404);
    res.send("The page you requested doesn't exist");
});


const multer = require('multer');
const helpers = require('./helpers');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

app.post('/upload-profile-pic', (req, res) => {
    console.log("got a thing");
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
        res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
    });
});

app.post('/upload-multiple-images', (req, res) => {
    // 10 is the limit I've defined for number of uploaded files at once
    // 'multiple_images' is the name of our file input field
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).array('multiple_images', 10);

    upload(req, res, function(err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        let result = "You have uploaded these images: <hr />";
        const files = req.files;
        let index, len;

        // Loop through all the uploaded images and display them on frontend
        for (index = 0, len = files.length; index < len; ++index) {
            result += `<img src="${files[index].path}" width="300" style="margin-right: 20px;">`;
        }
        result += '<hr/><a href="./">Upload more images</a>';
        res.send(result);
    });
});
