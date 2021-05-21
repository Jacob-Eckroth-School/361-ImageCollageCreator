var express = require('express');
var fs = require('fs');
//note that request is deprecated. If someone has a better easier way to send http requests from
//express / node.js servers PLEASE submit a pull request.
const request = require('request');

var exphbs = require('express-handlebars');
const path = require('path');
const https = require('https');
//app is our server.
var app = express();

//this tells it that we will use public as our default static folder. When receiving a request for a file like "index.html" or "index.js" it will check public/index.js or 
// public/index.html first

const MAXLENGTH = 30;

//body parser parses JSON bodies into nice javascript objects.
var bodyParser = require('body-parser');
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

//loading in ports from an external file so these can be edited easily.
var ports = require('./ports.json');

var servers = require('./serverAddresses.json')

const {
    fstat
} = require('fs');
var port = ports.collagePort;

app.listen(port, function () {
    app.set('views', __dirname + '/views');
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        extname: 'handlebars',
        layoutsDir: path.join(__dirname, "/views/layouts"),
        partialsDir: [
            path.join(__dirname, "/views/partials")
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
    console.log("==Server is listening on port ", port);
});

//this says that if we get a request for a page, first it will look through our
//publicCat/ folder to see if it can find it there. So if it gets a request for index.html
//it will look first to see if it's in there, and if it is just send it.
app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {

    res.render('homePage');

})



app.get('/uploadImages/:collageTitle', function (req, res, next) {
    var userTitle = req.params.collageTitle;
    if (userTitle.length > MAXLENGTH) {
        next();
    } else {
        res.render('uploadImages', {
            title: userTitle
        })
    }



})

app.get('/collageType/:collageTitle',function(req,res){
    res.status(200).send("welcome to this page!")
})




app.get('/result', function (req, res) {
    res.render('resultPage');
})

app.get('/result/:collageTitle/:style', function (req, res) {
    res.render('resultPage');
})


const createCollage = require(__dirname + "/createCollage");


app.get('/getCollage/:collageTitle/:style', function (req, res) {
    console.log("got request for collage");
    var fileName = req.params.collageTitle + ".png"
    res.status(200).send()

    var imagesDirectory = require('path').join(__dirname, "images", req.params.collageTitle);
    createCollage.createCollages(req.params.collageTitle, imagesDirectory);
    






})




app.post('/uploadImages', function (req, res) {
    var amountOfImages = req.body.imageAmount;
    var title = req.body.collageTitle;
    var dirLocation = path.join(__dirname, "/images", title)
    if (!fs.existsSync(dirLocation)) {
        fs.mkdirSync(dirLocation, 0744);
    }
    var imagesText = req.body.images;

    for (var i = 0; i < amountOfImages; i++) {
        var matches = imagesText[i].match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        var fileOut = dirLocation + "/" + i + ".png"
        fs.writeFileSync(fileOut, response.data, err => {

            if (err) {
                console.log(err);
            }
        })
    }
    res.status(200).send();
})


//STUFF FOR INTERACTIBILITY WITH OTHER SERVERS



app.get('/apirequest/:title', function (req, res) {
    console.log("got an api request from this title:",req.params.title)
    fs.readFile(path.join(__dirname, "public", "ExampleImage.png"), (err, data) => {
        if (err) res.status(500).send(err);

        //get image file extension name
        let extensionName = path.extname(path.join(__dirname, "public", "ExampleImage.png"));

        //convert image file to base64-encoded string
        let base64Image = new Buffer(data, 'binary').toString('base64');

        //combine all strings
        let imgSrcString = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
        var sendBody = {
            "id": "a9aslkj23jklasdfjlk1",
            "title": req.params.title,
            "collageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
            "wordCloudData":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
        }
        res.status(200).send(JSON.stringify(sendBody))
    })


})



function test() {
    const andyServer = servers.andyServer;
    console.log("Andy Server:", andyServer)
    https.get(andyServer, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {

            encodedData = new Buffer(data, 'base64')
            var fileOut = __dirname + "/andyImage.png"
            fs.writeFileSync(fileOut, encodedData, err => {

                if (err) {
                    console.log(err);
                }
            })
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}

function test2() {
    const robertServer = servers.robertServer
    var combinedRobertServer = robertServer + "Minecraft"
    console.log("robert Server: ",combinedRobertServer)
    https.get(combinedRobertServer, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(data)
            //console.log(JSON.parse(data));

        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}



//if we get here, then none of the above gets have worked, so we send this. You could also send a nice 404 page.
app.get('*', function (req, res) {
    res.status(404);
    res.send("The page you requested doesn't exist");
});