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


app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {

    res.render('homePage');

})



app.get('/uploadImages/:collageTitle', function (req, res, next) {
    var userTitle = req.params.collageTitle;


    var validLetters = /^[\w\s]+$/g;
   
    if(userTitle.match(validLetters)){
        if (userTitle.length > MAXLENGTH) {
            next();
        } else {
            res.render('uploadImages', {
                title: userTitle
            })
        }
    }else{
        res.status(500).render('404')       //could change this to be correct... but do I really care?? not really.
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

    var imageLocation = require('path').join(__dirname, "collages", req.params.collageTitle + "-" + req.params.style+".png");
    
    checkIfCollagesDirectoryExists();
    
    seeIfFileExists(imageLocation,2000,8,res)
        

})

//checks to see if the ~/collages directory exists, if it doesn't it creates it.
function checkIfCollagesDirectoryExists(){
    if(fs.existsSync(path.join(__dirname,"collages"))){
        return;
    }else{
        fs.mkdirSync(path.join(__dirname,"collages"))
    }
}
//checks to see if the ~/images directory exists, if it doesn't it creates it.
function checkIfImagesDirectoryExists(){
    if(fs.existsSync(path.join(__dirname,"images"))){
        return;
    }else{
        fs.mkdirSync(path.join(__dirname,"images"))
    }
}


function seeIfFileExists(fileLocation,timeout,checksLeft,res){
  
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

function checkIfUserDirectoryExists(dirLocation){
    if (!fs.existsSync(dirLocation)) {
        fs.mkdirSync(dirLocation, 0744);
    }else{  //TODO: Fix Security Flaw in emptying directory
        fsExtra.emptyDirSync(dirLocation)
    }
}


app.post('/uploadImages', function (req, res) {
    
    var title = req.body.collageTitle;
    checkIfImagesDirectoryExists();
    var dirLocation = path.join(__dirname, "/images", title)
    
    if(dirLocation.includes('.')){
        res.status(400).send("PLEASE DONT HAVE PERIODS")
    }


    checkIfUserDirectoryExists(dirLocation)
    writeImagesAndCreateCollages(dirLocation,title,req.body.images)
    
    res.status(200).send();
    
})

function writeImagesAndCreateCollages(dirLocation,title,imagesText){
    var savedImages = 0;
    var amountOfImages = imagesText.length;
    for (var i = 0; i < amountOfImages; i++) {
        var matches = imagesText[i].match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = (matches[1]).split('/').pop();
      
        response.data = new Buffer(matches[2], 'base64');
        var fileOut = dirLocation + "/" + i + "."+response.type;
        fs.writeFile(fileOut, response.data,function(err){
            if(err) return console.log(err);
            savedImages++;
            if(savedImages == amountOfImages){
         
                createCollage.createCollages(title,dirLocation)
            }
        })
    }
}



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
         
            const data = fs.readFileSync(fileLocation,'base64')     //TODO: make this asynchronous.

            sendImagesArray.push(data);
            
       
        })
        
    }
    responseBody.images = sendImagesArray;
    res.status(200).send(JSON.stringify(responseBody))
})



//STUFF FOR INTERACTIBILITY WITH OTHER SERVERS


app.get('/robert',function(req,res){
    res.render('robert')
})
app.get('/andy',function(req,res){
    res.render('andy')
})


app.get('/apiWordCloud',function(req,res){
    res.sendFile(path.join(__dirname,"api","wordcloud.png"))
})
app.get('/apiCollage',function(req,res){
    res.sendFile(path.join(__dirname,"api","collage.png"))
})



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
            
                var matches = allImages[i].base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
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
    res.render('404');
});
