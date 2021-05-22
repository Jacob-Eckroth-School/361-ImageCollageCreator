var express = require('express');
var fs = require('fs');
//note that request is deprecated. If someone has a better easier way to send http requests from
//express / node.js servers PLEASE submit a pull request.
const request = require('request');

var exphbs = require('express-handlebars');
const path = require('path');
const https = require('https');
var fsExtra = require('fs-extra')
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
var favicon = require('serve-favicon')
app.use(favicon(path.join(__dirname,'public','publicImages','favicon.ico')));

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
    res.render('collageTypePage')

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

    

    var imageLocation = require('path').join(__dirname, "collages", req.params.collageTitle + "-" + req.params.style+".png");
    console.log("Image Location:",imageLocation)
    seeIfFileExists(imageLocation,2000,8,res)
        
  


})

function seeIfFileExists(fileLocation,timeout,checksLeft,res){
    console.log("seeing if file exists with ",checksLeft," checks left")
    if(fs.existsSync(fileLocation)){
        res.sendFile(fileLocation)
     
    }else{
        if(checksLeft == 0){
            res.sendFile(path.join(__dirname,"public","publicImages","ohno.png"))
           
        }else{
            setTimeout(function(){
                seeIfFileExists(fileLocation,timeout,checksLeft-1,res)},timeout);
        }
    }
}



app.post('/uploadImages', function (req, res) {
    var amountOfImages = req.body.imageAmount;
    var title = req.body.collageTitle;
    var dirLocation = path.join(__dirname, "/images", title)
    if(dirLocation.includes('.')){
        res.status(400).send("PLEASE DONT HAVE PERIODS")
    }
    if (!fs.existsSync(dirLocation)) {
        fs.mkdirSync(dirLocation, 0744);
    }else{  //we want to empty the directory. note that this is a huge security flaw but I don't care
        fsExtra.emptyDirSync(dirLocation)
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
    createCollage.createCollages(title,dirLocation)
})


app.get('/checkForOldImages/:title',function(req,res){
    var title = req.params.title

    var responseBody = {
        images: []
    }
    var sendImagesArray = []
    var imagesDirectoryPath = path.join(__dirname,"images",title)
  
    if(fs.existsSync(imagesDirectoryPath)){
        arrayOfFiles = fs.readdirSync(imagesDirectoryPath)
        arrayOfFiles.forEach(function(file){
            fileLocation = path.join(imagesDirectoryPath,file)
            console.log(fileLocation)
            const data = fs.readFileSync(fileLocation,'base64')
            console.log('read the file')

            sendImagesArray.push(data);
            
            console.log('done reading file")')
        })
        
    }
    responseBody.images = sendImagesArray;
    res.status(200).send(JSON.stringify(responseBody))
})


//STUFF FOR INTERACTIBILITY WITH OTHER SERVERS



app.get('/apirequest/:title', function (req, res) {
    var robertURL = servers.robertServer + req.params.title;
    var andyURL = servers.andyServer;
    var sendBody = {
        "id": "whyAmIHavingAnID? I don't remember",
        "title": req.params.title,
        "collageData": "",
        "wordCloudData":""
    }

    var wordCloudLoaded = false;
    var collageLoaded = false;
    https.get(andyURL, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            
            encodedData = new Buffer(data, 'base64')
            var fileOut = path.join(__dirname,"api","wordcloud.png")
            fs.writeFile(fileOut, encodedData, err => {
               
                if (err) {
                    console.log(err);
                }
                wordCloudLoaded = true;
                if(wordCloudLoaded && collageLoaded){
          
                    sendFinalAPIRequest(res,sendBody);
                }
               
            })
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

   https.get(robertURL, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            try{
                data = JSON.parse(data);
            }catch{
                console.log("data is wrong");
                res.status(500).send("oh no");
                return;
            }
            fsExtra.emptyDirSync(path.join(__dirname,"api","images"))
       
            allImages = data.primary.concat(data.related);

            for(var i = 0; i < allImages.length; i++){
            
                var matches = allImages[i].match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                encodedData = new Buffer(matches[2], 'base64')
                var fileOut = path.join(__dirname,"api","images",i+".png")
                fs.writeFileSync(fileOut, encodedData);
              
               
            }
         
               let final = Promise.resolve(createCollage.createCollageAPI(path.join(__dirname,"api","images")))
               final.then(()=>{
            
                collageLoaded = true;
                
                if(wordCloudLoaded && collageLoaded){
                    sendFinalAPIRequest(res,sendBody)
                }
               })
               
            
           
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    }); 


})

function sendFinalAPIRequest(res,sendBody){
    console.log("sending final api");
    fs.readFile(path.join(__dirname, "api", "wordcloud.png"), (err, data) => {
        if (err) res.status(500).send(err);

        //get image file extension name
        let extensionName = path.extname(path.join(__dirname, "api", "wordcloud.png"));

        //convert image file to base64-encoded string
        let base64Image = new Buffer(data, 'binary').toString('base64');

        //combine all strings
        let imgSrcString = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
       
        sendBody.wordCloudData = imgSrcString;
       
        fs.readFile(path.join(__dirname,"api","collage.png"),(err,data)=>{
            if (err) res.status(500).send(err);

            //get image file extension name
            let extensionName = path.extname(path.join(__dirname, "api", "wordcloud.png"));

            //convert image file to base64-encoded string
            let base64Image = new Buffer(data, 'binary').toString('base64');

            //combine all strings
            let imgSrcString = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
        
        
            sendBody.collageData = imgSrcString;
            res.status(200).send(JSON.stringify(sendBody))
        })
        
        
    })
}




//if we get here, then none of the above gets have worked, so we send this. You could also send a nice 404 page.
app.get('*', function (req, res) {
    res.status(404);
    res.send("The page you requested doesn't exist");
});