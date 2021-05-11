
const fs = require('fs')
const path = require('path')
const { createCanvas,loadImage } = require('canvas')
const { randomBytes, randomInt } = require('crypto')

const width = 1200
const height = 1200

const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

context.fillStyle = '#ffffff'
context.fillRect(0, 0, width, height)


var images = []

async function loadImages(imagePathArray){
    for(let i = 0; i < imagePathArray.length; i++){
            await loadImage(imagePathArray[i]).then(image => {
            images.push(image);
   
          
        })
    }
   

}

function createCollage(title,dirLocation){
    var images = [];
    fs.readdir(dirLocation, function(err,files){
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            images.push(path.join(dirLocation,file));
            console.log(images);
        });
        createCanvasAsync(images,title);
    })
 

}
exports.createCollage = createCollage;

async function createCanvasAsync(images,title){
   await loadImages(images);
   placeImagesOnCanvas(title);
}


function placeImagesOnCanvas(title){

    let horizontalSections,verticalSections;
    if(images.length < 3){
        horizontalSections = images.length;
    }else if(images.length < 8){
        horizontalSections = 3.
    }else{
        horizontalSections = 4.
    }
    if(images.length < 6){
        verticalSections = 1.;
    }else if(images.length < 9){
        verticalSections = 2.;
    }else{
        verticalSections = 3.;
    }
    let horizontalAdvance  = width / horizontalSections;

    let verticalAdvance = height / verticalSections;
    
    var currentImageIndex = 0;
    while(true){
        for(var x = 0; x < horizontalSections; x++){
            for(var y = 0; y < verticalSections; y++){
 
                var placeX = x * horizontalAdvance + randomInt(0,horizontalAdvance);
                var placeY = y * verticalAdvance + randomInt(0,verticalAdvance);
                var currentImage = images[currentImageIndex];
           
                var wToH = currentImage.width / currentImage.height;
          
                let newHeight, newWidth;
                if(images.width > images.height){
                 
                    newWidth = horizontalAdvance *  (randomInt(7,10) * .1);
                    
                    newHeight = newWidth / wToH;
                }else{
                   
                    newHeight = verticalAdvance  *  (randomInt(7,10) * .1); ;
                    newWidth = newHeight * wToH;
                }
                if(placeX + newWidth > width){
                    placeX = width - newWidth;
                }
                if(placeY + newHeight > height){
                    placeY = height - newHeight;
                }
              
                context.drawImage(currentImage,placeX,placeY,newWidth,newHeight);
                

                currentImageIndex++;
                if(currentImageIndex >= images.length){
                    const buffer = canvas.toBuffer('image/png')
                    fs.writeFileSync(path.join(__dirname,'collages',title+".png"), buffer)
                    return;
                }
            }
            
        }
       
    }
 


}
