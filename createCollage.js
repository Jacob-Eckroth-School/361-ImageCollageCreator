const fs = require('fs')
const path = require('path')
const {
    createCanvas,
    loadImage
} = require('canvas')
const {
    randomBytes,
    randomInt
} = require('crypto')

const width = 1200
const height = 1200

var currentImages = []

async function loadImages(imagePathArray) {
    var newImages = []
    for (let i = 0; i < imagePathArray.length; i++) {
        await loadImage(imagePathArray[i]).then(image => {
            newImages.push(image);


        })
    }
    return newImages


}

function createCollage(title, dirLocation) {
    var images = [];
    fs.readdir(dirLocation, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            images.push(path.join(dirLocation, file));

        });
        createCanvasAsync(images, title);
    })


}
exports.createCollage = createCollage;

async function createCanvasAsync(images, title) {
    currentImages = await loadImages(images);
    
    placeImagesOnCanvasDistributedCorners(title);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

const maxImageWidth = 600
const maxImageHeight = 600
const minImageWidth = 400
const minImageHeight = 400
const backgroundColor = '#090909'


function placeImagesOnCanvasDistributedCorners(title) {
    shuffle(currentImages)
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    context.fillStyle = backgroundColor
    context.fillRect(0, 0, width, height)

    var images = currentImages
    var numImages = images.length;
//assuming there are 4 images at least
    currentImageIndex = 0;
    //placing in corners
    var info = {
        leftTopMaxX:0,
        leftTopMaxY:0,
        rightTopMaxY:0,
        leftBottomMaxX:0,
    }
    for(var i = 0; i < 4; i++){
        if(currentImageIndex > numImages){
            break;
        }
        var currentImage = images[currentImageIndex]
        var currentWidth = Number(currentImage.width);
        var currentHeight = Number(currentImage.height);
        var wToH = currentImage.width / currentImage.height;
        let newWidth, newHeight;
        if (currentWidth > currentHeight) {
            newWidth = randomInt(minImageWidth, maxImageWidth)
            newHeight = Math.floor(newWidth / wToH);
        } else {
            newHeight = randomInt(minImageHeight, maxImageHeight)
            newWidth = Math.floor(newHeight * wToH);
        }
        var xPos,yPos;
        if(i%2==0){
            xPos = 0
        }else{
            xPos = width - newWidth
        }
        if(i < 2){
            yPos = 0
        }else{
            yPos = height-newHeight
        }
        if(i===0){
            info.leftTopMaxX = xPos + newWidth
            info.leftTopMaxY = yPos + newHeight
        }else if(i===1){
            info.rightTopMaxY = yPos + newHeight
        }else if(i===2){
            info.leftBottomMaxX = xPos + newWidth
        }
        context.drawImage(currentImage, xPos, yPos, newWidth, newHeight)
        currentImageIndex++
    }

    for(var i = 0; i < 4; i++){
        if(currentImageIndex > numImages){
            break;
        }
        var currentImage = images[currentImageIndex]
        var currentWidth = Number(currentImage.width);
        var currentHeight = Number(currentImage.height);
        var wToH = currentImage.width / currentImage.height;
        let newWidth, newHeight;
        if (currentWidth > currentHeight) {
            newWidth = randomInt(minImageWidth, maxImageWidth)
            newHeight = Math.floor(newWidth / wToH);
        } else {
            newHeight = randomInt(minImageHeight, maxImageHeight)
            newWidth = Math.floor(newHeight * wToH);
        }
        var xPos,yPos;
        switch(i){
            case 0:
                xPos = info.leftTopMaxX
                yPos = 0
            break;
            case 1:
                xPos = 0
                yPos = info.leftTopMaxY
            break;
            case 2:
                xPos = width-newWidth
                yPos = info.rightTopMaxY
                break;
            case 3:
                xPos = info.leftBottomMaxX
                yPos = height- newHeight
            break;
        }
        context.drawImage(currentImage, xPos, yPos, newWidth, newHeight)
        currentImageIndex++
    }

    while(currentImageIndex < numImages){
        var currentImage = images[currentImageIndex]
        var currentWidth = Number(currentImage.width);
        var currentHeight = Number(currentImage.height);
        var wToH = currentImage.width / currentImage.height;
        let newWidth, newHeight;
        if (currentWidth > currentHeight) {
            newWidth = randomInt(minImageWidth, maxImageWidth)
            newHeight = Math.floor(newWidth / wToH);
        } else {
            newHeight = randomInt(minImageHeight, maxImageHeight)
            newWidth = Math.floor(newHeight * wToH);
        }
        var xPos,yPos
        var foundSpot = false
      
        for(var x = 0; x < width-newWidth; x++){
            for(var y = 0; y < height-newHeight; y++){
                var pixel = context.getImageData(x,y,1,1)
                var data = pixel.data;
            
                if(data[0] === 9 && data[1] === 9 && data[2] === 9){
                    
                    xPos = x;
                    yPos = y
                    foundSpot = true;
                    break;
                }
            }
            if(foundSpot = true){
                break;
            }
        }
        if(!foundSpot){
            xPos = randomInt(0,width-newWidth)
            yPos = randomInt(0,height-newHeight)
        }


        context.drawImage(currentImage, xPos, yPos, newWidth, newHeight)
        currentImageIndex++
    }
   

    currentImages = []
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(path.join(__dirname, 'collages', title + ".png"), buffer)

}

function placeImagesOnCanvas(title) {

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    context.fillStyle = '#666666'
    context.fillRect(0, 0, width, height)

    var images = currentImages
    var numImages = images.length;


    rects = []
    var currentXQuadrant = 0
    var currentYQuadrant = 0
    var xQuadrants = 2
    var yQuadrants = 2
    var xQuadrantLength = width / xQuadrants;
    var yQuadrantLength = height / yQuadrants
    for (var i = 0; i < numImages; i++) {
        var currentImage = images[i]
        var currentWidth = Number(currentImage.width);
        var currentHeight = Number(currentImage.height);
        var wToH = currentImage.width / currentImage.height;
        let newWidth, newHeight;
        if (currentWidth > currentHeight) {
            newWidth = randomInt(minImageWidth, maxImageWidth)
            newHeight = Math.floor(newWidth / wToH);
        } else {
            newHeight = randomInt(minImageHeight, maxImageHeight)
            newWidth = Math.floor(newHeight * wToH);
        }
        var xPlacement = randomInt(currentXQuadrant * xQuadrantLength, ((currentXQuadrant + 1) * xQuadrantLength) - newWidth)
        var yPlacement = randomInt(currentYQuadrant * yQuadrantLength, ((currentYQuadrant + 1) * yQuadrantLength) - newHeight)
        console.log(xPlacement, " ", yPlacement)
        context.drawImage(currentImage, xPlacement, yPlacement, newWidth, newHeight)
        currentXQuadrant++
        if (currentXQuadrant > xQuadrants) {
            currentXQuadrant = 0
            currentYQuadrant++
            if (currentYQuadrant > yQuadrants) {
                currentYQuadrant = 0
            }
        }
    }



    currentImages = []
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(path.join(__dirname, 'collages', title + ".png"), buffer)


}

