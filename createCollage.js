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



function loadImages(imagePathArray) {
    return new Promise(resolve => {
        var newImages = []
        for (let i = 0; i < imagePathArray.length; i++) {
            loadImage(imagePathArray[i]).then(image => {
                newImages.push(image);
                if (newImages.length >= imagePathArray.length) {
                    resolve(newImages);

                }
            })
        }
    })



}


function createCollages(title, dirLocation) {
    var images = [];
    var start = new Date();
    fs.readdir(dirLocation, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            images.push(path.join(dirLocation, file));

        });
        createCanvasAsync(images, title, start);



    })


}
exports.createCollages = createCollages;

const async = require('async');

async function createCanvasAsync(images, title, startTime) {

    var currentImages = await loadImages(images);

    var currentImagesCopy = [...currentImages]
    var currentImagesCopy2 = [...currentImages]

    if (currentImages.length == 0) {
        return
    }

    
    placeImagesOnCanvasDistributedCorners(title, true, true, currentImages)
    placeImagesOnCanvasDistributedCorners(title, true, false, currentImagesCopy)
   
    placeImagesOnCanvasDistributedCorners(title, false, false, currentImagesCopy2)
    var finish = new Date();
    var difference = new Date();
    difference.setTime(finish.getTime() - startTime.getTime());
    console.log("Runtime in seconds:", difference.getSeconds() + difference.getMilliseconds() / 1000.);
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

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

function initializeContext(canvas) {
    const context = canvas.getContext('2d')

    context.fillStyle = backgroundColor
    context.fillRect(0, 0, width, height)
    return context;
}


function placeImagesOnCanvasDistributedCorners(title, drawingTitle, strokeText, currentImages) {
    return new Promise(resolve=>{
        shuffle(currentImages)
        const canvas = createCanvas(width, height)
        const context = initializeContext(canvas);
    
        currentImageIndex = 0;
        //placing in corners
        var imageInfo = drawFirstFourImagesToCanvas(currentImageIndex, currentImages, context);
        currentImageIndex += 4; //increase by 4 because first function draws 4 images
        drawSecondFourImagesToCanvas(currentImageIndex, currentImages, context, imageInfo);
        currentImageIndex += 4; //increase by 4 because we drew 4 images.
        drawTheRestOfImagesToCanvas(currentImageIndex, currentImages, context);
    
        if (drawingTitle) {
            drawTitleToCanvas(strokeText, context, title);
        }
    
        writeCanvasToFile(canvas, title, drawingTitle, strokeText);
        resolve("finished");
    })
   


}





async function createCollageAPI(dirLocation) {

    var images = [];
    filenames = fs.readdirSync(dirLocation)

    filenames.forEach(function (file) {
        // Do whatever you want to do with the file
        images.push(path.join(dirLocation, file));

    });

    await createCanvasAPI(images);
}

exports.createCollageAPI = createCollageAPI

async function createCanvasAPI(images) {

    images = await loadImages(images);
    if (images.length == 0) {
        return
    }
    placeImagesOnCanvasDistributedCornersAPI(images);
   
}



function placeImagesOnCanvasDistributedCornersAPI(images) {
    images = shuffle(images);
    const canvas = createCanvas(width, height)
    const context = initializeContext(canvas);


    //assuming there are 4 images at least
    currentImageIndex = 0;
    //placing in corners
    var imageInfo = drawFirstFourImagesToCanvas(currentImageIndex, images, context);
    currentImageIndex +=4;
    drawSecondFourImagesToCanvas(currentImageIndex, images, context, imageInfo);
    currentImageIndex += 4; //increase by 4 because we drew 4 images.

    drawTheRestOfImagesToCanvas(currentImageIndex, images, context);
    const buffer = canvas.toBuffer('image/png')
    console.log("writing image")
    fs.writeFileSync(path.join(__dirname, 'api', "collage.png"), buffer)

}




function writeCanvasToFile(canvas, title, drawingTitle, strokeText) {
    const buffer = canvas.toBuffer('image/png')
    var extension;
    if (drawingTitle == false) {
        extension = "-blank"
    } else if (strokeText == false) {
        extension = "-text"
    } else if (strokeText == true) {
        extension = "-stroke"
    }
    fs.writeFile(path.join(__dirname, 'collages', title + extension + ".png"), buffer, function (err) {
        if (err) throw err;
    })
}

function drawFirstFourImagesToCanvas(currentImageIndex, images, context) {
    var numImages = images.length;
    var info = {
        leftTopMaxX: 0,
        leftTopMaxY: 0,
        rightTopMaxY: 0,
        leftBottomMaxX: 0,
    }
    for (var i = 0; i < 4; i++) {
        if (currentImageIndex >= numImages) {
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
        var xPos, yPos;
        if (i % 2 == 0) {
            xPos = 0
        } else {
            xPos = width - newWidth
        }
        if (i < 2) {
            yPos = 0
        } else {
            yPos = height - newHeight
        }
        if (i === 0) {
            info.leftTopMaxX = xPos + newWidth
            info.leftTopMaxY = yPos + newHeight
        } else if (i === 1) {
            info.rightTopMaxY = yPos + newHeight
        } else if (i === 2) {
            info.leftBottomMaxX = xPos + newWidth
        }
        context.drawImage(currentImage, xPos, yPos, newWidth, newHeight)
        currentImageIndex++
    }
    return info;
}

function drawSecondFourImagesToCanvas(currentImageIndex, images, context, imageInfo) {
    for (var i = 0; i < 4; i++) {
        if (currentImageIndex >= images.length) {
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
        var xPos, yPos;
        switch (i) {
            case 0:
                xPos = imageInfo.leftTopMaxX
                yPos = 0
                break;
            case 1:
                xPos = 0
                yPos = imageInfo.leftTopMaxY
                break;
            case 2:
                xPos = width - newWidth
                yPos = imageInfo.rightTopMaxY
                break;
            case 3:
                xPos = imageInfo.leftBottomMaxX
                yPos = height - newHeight
                break;
        }
        context.drawImage(currentImage, xPos, yPos, newWidth, newHeight)
        currentImageIndex++
    }
}

function drawTheRestOfImagesToCanvas(currentImageIndex, images, context) {

    while (currentImageIndex < images.length) {
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
        var xPos, yPos
        var foundSpot = false

        for (var x = 0; x < width - newWidth; x++) {
            for (var y = 0; y < height - newHeight; y++) {
                var pixel = context.getImageData(x, y, 1, 1)
                var data = pixel.data;

                if (data[0] === 9 && data[1] === 9 && data[2] === 9) {

                    xPos = x;
                    yPos = y
                    foundSpot = true;
                    break;
                }
            }
            if (foundSpot = true) {
                break;
            }
        }
        if (!foundSpot) {
            xPos = randomInt(0, width - newWidth)
            yPos = randomInt(0, height - newHeight)
        }


        context.drawImage(currentImage, xPos, yPos, newWidth, newHeight)
        currentImageIndex++
    }
}


function drawTitleToCanvas(strokeText, context, title) {
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;

    fontSize = 200 - title.length * 5;

    context.shadowColor = "rgba(0,0,0,0.3)";


    context.shadowBlur = 4;
    context.font = fontSize + "px Arial";
    lineHeight = context.measureText('M').width;
    context.fillStyle = "white"
    context.textAlign = "center"
    context.fillText(title, width / 2, lineHeight + 10)

    if (strokeText) {
        context.strokeStyle = "black"
        context.lineWidth = 5 - title.length / 10.
        context.strokeText(title, width / 2, lineHeight + 10)
    }

}
